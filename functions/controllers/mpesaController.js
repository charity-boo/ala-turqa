const mpesaService = require('../services/mpesaService');
const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const { normalizePhoneNumber } = require('../utils/mpesaHelpers');

/**
 * Read the M-Pesa environment from Firestore settings (admin-toggleable).
 * Falls back to the MPESA_ENV secret / 'sandbox' if the doc doesn't exist.
 */
const getMpesaEnv = async () => {
  try {
    const settingsDoc = await db.collection('settings').doc('mpesa').get();
    if (settingsDoc.exists) {
      const data = settingsDoc.data();
      if (data.env === 'production' || data.env === 'sandbox') {
        return data.env;
      }
    }
  } catch (err) {
    console.warn('[M-Pesa] Could not read Firestore settings/mpesa, falling back to env secret:', err.message);
  }
  return null; // let the config default apply
};

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

    // 5. Read admin-configurable environment from Firestore
    const envOverride = await getMpesaEnv();

    // Enhanced request logging
    console.info(`[M-Pesa] STK Push Request Received:
      - Order ID: ${orderId} (Ref: ${orderData.orderNumber || 'N/A'})
      - Customer Name: ${orderData.customerName || 'N/A'}
      - Phone Number: ${phone}
      - Email: ${orderData.email || 'None'}
      - Delivery Method: ${orderData.deliveryMethod || 'Delivery'} (${orderData.deliveryProvider || 'N/A'})
      - Items Count: ${orderData.items?.length || 0}
      - Authoritative Amount: KES ${authoritativeAmount}
      - Environment: ${envOverride || 'default (sandbox)'}
    `);

    // Call Daraja API using the authoritative amount
    const response = await mpesaService.sendStkPush(phone, authoritativeAmount, orderId, envOverride);
    
    console.info(`[M-Pesa] STK Push Initiated Successfully:
      - Order ID: ${orderId}
      - CheckoutRequestID: ${response.CheckoutRequestID}
      - MerchantRequestID: ${response.MerchantRequestID}
      - ResponseCode: ${response.ResponseCode}
      - ResponseDescription: ${response.ResponseDescription}
      - CustomerMessage: ${response.CustomerMessage || 'N/A'}
    `);

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
      environment: envOverride || 'sandbox',
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

    console.info(`[M-Pesa] Payment Intent & Audit Event stored in Firestore for CheckoutRequestID: ${response.CheckoutRequestID}`);

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

        console.info(`[M-Pesa Callback Success] Payment Completed:
          - Order ID: ${orderId}
          - CheckoutRequestID: ${checkoutRequestId}
          - M-Pesa Receipt: ${receiptNumber}
          - Amount: KES ${amount}
          - Phone: ${phoneNumber}
          - Date: ${transactionDate}
        `);

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
        console.warn(`[M-Pesa Callback Failed/Cancelled]:
          - Order ID: ${orderId}
          - CheckoutRequestID: ${checkoutRequestId}
          - ResultCode: ${resultCode}
          - ResultDesc: ${resultDesc}
          - Final Status Set: ${finalStatus}
        `);

        transaction.update(paymentDocRef, {
          status: finalStatus,
          resultCode,
          resultDescription: resultDesc,
          updatedAt: new Date()
        });

        if (orderDoc.exists) {
          transaction.update(orderRef, {
            paymentStatus: finalStatus,
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

    console.info(`[M-Pesa] Transaction callback processed & recorded for CheckoutRequestID: ${checkoutRequestId}`);
    res.status(200).json({ message: 'Callback processed successfully' });

  } catch (error) {
    console.error('[M-Pesa] Callback Processing Error:', error.message);
    // Still return 200 to Safaricom so they stop retrying
    res.status(200).send('Error processing callback');
  }
};

/**
 * GET /api/payment/mpesa/settings
 * Returns the current M-Pesa environment setting for the admin dashboard.
 */
const getSettings = async (req, res) => {
  try {
    const settingsDoc = await db.collection('settings').doc('mpesa').get();
    const data = settingsDoc.exists ? settingsDoc.data() : { env: 'sandbox' };
    res.status(200).json({
      env: data.env || 'sandbox',
      updatedAt: data.updatedAt || null,
      updatedBy: data.updatedBy || null
    });
  } catch (error) {
    console.error('[M-Pesa] Error reading settings:', error.message);
    res.status(500).json({ error: 'Failed to read M-Pesa settings' });
  }
};

/**
 * PUT /api/payment/mpesa/settings
 * Updates the M-Pesa environment (sandbox/production). Admin-only.
 */
const updateSettings = async (req, res) => {
  try {
    const { env } = req.body;
    
    if (!env || !['sandbox', 'production'].includes(env)) {
      return res.status(400).json({ error: 'Invalid environment. Must be "sandbox" or "production".' });
    }

    // Verify admin token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Check admin claim
    if (!decodedToken.admin && !decodedToken.role) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    await db.collection('settings').doc('mpesa').set({
      env,
      updatedAt: new Date(),
      updatedBy: decodedToken.uid
    }, { merge: true });

    console.info(`[M-Pesa] Environment switched to ${env} by ${decodedToken.email || decodedToken.uid}`);

    res.status(200).json({ 
      message: `M-Pesa environment switched to ${env}`,
      env 
    });
  } catch (error) {
    console.error('[M-Pesa] Error updating settings:', error.message);
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
    res.status(500).json({ error: 'Failed to update M-Pesa settings' });
  }
};

module.exports = {
  initiateStkPush,
  handleCallback,
  getSettings,
  updateSettings
};
