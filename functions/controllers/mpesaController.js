const mpesaService = require('../services/mpesaService');
const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const { normalizePhoneNumber } = require('../utils/mpesaHelpers');

const initiateStkPush = async (req, res) => {
  try {
    const { orderId, phone, amount } = req.body;

    if (!orderId || !phone) {
      return res.status(400).json({ error: 'Missing required fields: orderId, phone' });
    }

    // 1. Retrieve the order from Firestore to use the authoritative total amount
    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    
    if (!orderSnap.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const orderData = orderSnap.data();
    
    // 2. Validate that the order has not already been paid
    if (orderData.paymentStatus === 'paid' || orderData.paymentStatus === 'completed') {
      return res.status(400).json({ error: 'Order is already paid' });
    }

    // Optional: If authentication is present, verify ownership
    if (orderData.userId) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
      }
      const idToken = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (decodedToken.uid !== orderData.userId) {
          return res.status(403).json({ error: 'Forbidden: You do not own this order' });
        }
      } catch (err) {
        console.error('[M-Pesa] Token verification failed:', err.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
    }

    // 3. Calculate or retrieve authoritative total
    const authoritativeAmount = Number(orderData.total || orderData.totalAmount);
    
    if (!authoritativeAmount || authoritativeAmount <= 0) {
      return res.status(400).json({ error: 'Invalid order amount' });
    }

    // 4. Validate frontend amount matches (optional but good for debugging/sync)
    if (amount && Number(amount) !== authoritativeAmount) {
      console.warn(`[M-Pesa] Amount mismatch for Order ${orderId}. Frontend: ${amount}, DB: ${authoritativeAmount}`);
      return res.status(400).json({ error: 'Amount mismatch detected' });
    }

    // Add logging
    console.info(`[M-Pesa] STK Push request received for Order: ${orderId}, Authoritative Amount: ${authoritativeAmount}`);

    // Call Daraja API using the authoritative amount
    const response = await mpesaService.sendStkPush(phone, authoritativeAmount, orderId);
    
    console.info(`[M-Pesa] STK Push initiated successfully. CheckoutRequestID: ${response.CheckoutRequestID}`);

    const normalizedPhone = normalizePhoneNumber(phone);
    const paymentsRef = db.collection('payments');
    
    // Save transaction to Firestore
    const newPaymentDoc = paymentsRef.doc();
    await newPaymentDoc.set({
      orderId,
      amount: authoritativeAmount,
      phoneNumber: normalizedPhone,
      paymentMethod: 'mpesa',
      status: 'pending',
      merchantRequestId: response.MerchantRequestID,
      checkoutRequestId: response.CheckoutRequestID,
      mpesaReceiptNumber: null,
      transactionDate: null,
      resultCode: null,
      resultDescription: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await db.collection('payment_events').add({
      paymentId: newPaymentDoc.id,
      orderId,
      eventType: 'STK_INITIATED',
      timestamp: new Date(),
      resultCode: null,
      resultDescription: null,
      checkoutRequestId: response.CheckoutRequestID,
      mpesaReceiptNumber: null
    });

    console.info(`[M-Pesa] Payment intent stored in Firestore for CheckoutRequestID: ${response.CheckoutRequestID}`);

    res.status(200).json({
      message: 'STK Push initiated successfully. Please check your phone.',
      merchantRequestId: response.MerchantRequestID,
      checkoutRequestId: response.CheckoutRequestID,
    });

  } catch (error) {
    console.error(`[M-Pesa] STK Push Error for Order ${req.body.orderId || 'Unknown'}:`, error.message);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const handleCallback = async (req, res) => {
  try {
    const callbackData = req.body?.Body?.stkCallback;
    if (!callbackData) {
      console.warn(`[M-Pesa] Callback missing STK Callback body`);
      return res.status(200).send('Acknowledged');
    }

    const checkoutRequestId = callbackData.CheckoutRequestID;
    const merchantRequestId = callbackData.MerchantRequestID;
    const resultCode = callbackData.ResultCode;
    const resultDesc = callbackData.ResultDesc;

    console.info(`[M-Pesa] Callback received. CheckoutRequestID: ${checkoutRequestId}, ResultCode: ${resultCode}, ResultDesc: ${resultDesc}`);

    // Log the event immediately to audit
    await db.collection('payment_events').add({
      paymentId: null, // we will update this soon if found
      orderId: null,
      eventType: 'CALLBACK_RECEIVED',
      timestamp: new Date(),
      resultCode,
      resultDescription: resultDesc,
      checkoutRequestId,
      mpesaReceiptNumber: null
    });

    const paymentsRef = db.collection('payments');
    const q = paymentsRef.where('checkoutRequestId', '==', checkoutRequestId).limit(1);
    const snapshot = await q.get();
    
    if (snapshot.empty) {
      console.warn(`[M-Pesa] Callback received for unknown checkoutRequestId: ${checkoutRequestId}`);
      return res.status(200).send('Acknowledged'); // Always send 200 to Safaricom
    }

    const paymentDocRef = snapshot.docs[0].ref;

    await db.runTransaction(async (transaction) => {
      const paymentDoc = await transaction.get(paymentDocRef);
      if (!paymentDoc.exists) {
        throw new Error("Payment doc does not exist!");
      }

      const paymentData = paymentDoc.data();
      const orderId = paymentData.orderId;
      
      // Idempotency check
      if (paymentData.status === 'completed' || paymentData.status === 'failed' || paymentData.status === 'cancelled') {
        console.info(`[M-Pesa] Payment already in terminal state (${paymentData.status}) for CheckoutRequestID: ${checkoutRequestId}`);
        return;
      }

      const orderRef = db.collection('orders').doc(orderId);
      const orderDoc = await transaction.get(orderRef);

      let receiptNumber = null;
      let transactionDate = null;
      let phoneNumber = paymentData.phoneNumber;
      let amount = paymentData.amount;

      if (resultCode === 0) {
        const callbackMetadata = callbackData.CallbackMetadata?.Item || [];
        receiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value || null;
        transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value || null;
        const cbPhoneNumber = callbackMetadata.find(item => item.Name === 'PhoneNumber')?.Value;
        if (cbPhoneNumber) phoneNumber = cbPhoneNumber.toString();
        const cbAmount = callbackMetadata.find(item => item.Name === 'Amount')?.Value;
        if (cbAmount) amount = cbAmount;

        // Verify amount
        if (Number(amount) !== Number(paymentData.amount)) {
          console.warn(`[M-Pesa] Amount mismatch for CheckoutRequestID: ${checkoutRequestId}. Expected: ${paymentData.amount}, Got: ${amount}`);
          // Should we fail it? Yes, partial payment or wrong amount is a failure
          transaction.update(paymentDocRef, {
            status: 'failed',
            resultCode: 1, // Custom internal code for mismatch
            resultDescription: 'Amount mismatch',
            updatedAt: new Date()
          });
          
          if (orderDoc.exists) {
            transaction.update(orderRef, {
              paymentStatus: 'failed',
              updatedAt: new Date()
            });
          }
          
          const eventsRef = db.collection('payment_events').doc();
          transaction.set(eventsRef, {
            paymentId: paymentDoc.id,
            orderId,
            eventType: 'PAYMENT_FAILED',
            timestamp: new Date(),
            resultCode: 1,
            resultDescription: 'Amount mismatch',
            checkoutRequestId,
            mpesaReceiptNumber: null
          });
          return;
        }

        transaction.update(paymentDocRef, {
          status: 'completed',
          resultCode,
          resultDescription: resultDesc,
          mpesaReceiptNumber: receiptNumber,
          transactionDate: transactionDate,
          phoneNumber: phoneNumber,
          amount: amount,
          updatedAt: new Date()
        });

        if (orderDoc.exists) {
          transaction.update(orderRef, {
            paymentStatus: 'paid',
            paymentMethod: 'mpesa',
            mpesaReceiptNumber: receiptNumber,
            checkoutRequestId: checkoutRequestId,
            merchantRequestId: merchantRequestId,
            paymentTimestamp: transactionDate ? new Date(transactionDate) : new Date(),
            updatedAt: new Date()
          });
        }

        const eventsRef = db.collection('payment_events').doc();
        transaction.set(eventsRef, {
          paymentId: paymentDoc.id,
          orderId,
          eventType: 'PAYMENT_COMPLETED',
          timestamp: new Date(),
          resultCode,
          resultDescription: resultDesc,
          checkoutRequestId,
          mpesaReceiptNumber: receiptNumber
        });

      } else {
        const finalStatus = resultCode === 1032 ? 'cancelled' : 'failed';
        transaction.update(paymentDocRef, {
          status: finalStatus,
          resultCode,
          resultDescription: resultDesc,
          updatedAt: new Date()
        });

        if (orderDoc.exists) {
          transaction.update(orderRef, {
            paymentStatus: 'failed',
            checkoutRequestId: checkoutRequestId,
            updatedAt: new Date()
          });
        }

        const eventsRef = db.collection('payment_events').doc();
        transaction.set(eventsRef, {
          paymentId: paymentDoc.id,
          orderId,
          eventType: finalStatus === 'cancelled' ? 'PAYMENT_CANCELLED' : 'PAYMENT_FAILED',
          timestamp: new Date(),
          resultCode,
          resultDescription: resultDesc,
          checkoutRequestId,
          mpesaReceiptNumber: null
        });
      }
    });

    console.info(`[M-Pesa] Transaction completed successfully for CheckoutRequestID: ${checkoutRequestId}`);
    res.status(200).json({ message: 'Callback processed successfully' });

  } catch (error) {
    console.error('[M-Pesa] Callback Processing Error:', error.message);
    // Still return 200 to Safaricom so they stop retrying
    res.status(200).send('Error processing callback');
  }
};

module.exports = {
  initiateStkPush,
  handleCallback
};
