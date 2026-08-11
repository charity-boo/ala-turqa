const mpesaService = require('../services/mpesaService');
const { db } = require('../config/firebase');
const { normalizePhoneNumber, generatePaymentNumber } = require('../utils/mpesaHelpers');

const initiateStkPush = async (req, res) => {
  try {
    const { orderId, phone, amount } = req.body;

    if (!orderId || !phone || !amount) {
      return res.status(400).json({ error: 'Missing required fields: orderId, phone, amount' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Call Daraja API
    const response = await mpesaService.sendStkPush(phone, amount, orderId);

    // Save transaction to Firestore
    const normalizedPhone = normalizePhoneNumber(phone);
    const paymentNumber = generatePaymentNumber();
    
    // Check if order exists and fetch orderNumber to link properly, but orderId is already the Firestore document ID.
    // In phase 4, the user asked to have paymentNumber and orderNumber.
    // Since we only receive orderId from the client, we might want to store orderNumber if the client passed it, or we could fetch it. Let's just fetch the order from firestore to get the orderNumber.
    
    let orderNumber = orderId; // fallback
    try {
      const orderDoc = await db.collection('orders').doc(orderId).get();
      if (orderDoc.exists) {
        orderNumber = orderDoc.data().orderNumber || orderId;
      }
    } catch (e) {
      console.warn("Failed to fetch order details for payment:", e.message);
    }

    await db.collection('payments').add({
      paymentNumber,
      orderNumber,
      orderId, // keeping the reference ID to not break backward compatibility
      amount: Number(amount),
      paymentMethod: 'mpesa',
      paymentStatus: 'pending',
      transactionReference: null,
      checkoutRequestId: response.CheckoutRequestID,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(200).json({
      message: 'STK Push initiated successfully. Please check your phone.',
      merchantRequestId: response.MerchantRequestID,
      checkoutRequestId: response.CheckoutRequestID,
    });

  } catch (error) {
    console.error('STK Push Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const handleCallback = async (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;
    const checkoutRequestId = callbackData.CheckoutRequestID;
    const resultCode = callbackData.ResultCode;
    const resultDesc = callbackData.ResultDesc;

    // Find the payment document using checkoutRequestId
    const paymentsRef = db.collection('payments');
    const q = paymentsRef.where('checkoutRequestId', '==', checkoutRequestId).limit(1);
    const snapshot = await q.get();

    if (snapshot.empty) {
      console.warn(`Callback received for unknown checkoutRequestId: ${checkoutRequestId}`);
      return res.status(200).send('Acknowledged'); // Always send 200 to Safaricom
    }

    const paymentDoc = snapshot.docs[0];
    const paymentData = paymentDoc.data();
    const orderId = paymentData.orderId;

    if (resultCode === 0) {
      // Payment Successful
      const callbackMetadata = callbackData.CallbackMetadata.Item;
      const receiptNumberItem = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber');
      const receiptNumber = receiptNumberItem ? receiptNumberItem.Value : '';

      // 1. Update payment doc
      await paymentDoc.ref.update({
        paymentStatus: 'completed',
        resultCode,
        resultDescription: resultDesc,
        transactionReference: receiptNumber,
        updatedAt: new Date()
      });

      // 2. Update order doc
      const orderRef = db.collection('orders').doc(orderId);
      const orderSnap = await orderRef.get();
      if (orderSnap.exists) {
        await orderRef.update({
          paymentStatus: 'paid',
          paymentMethod: 'M-Pesa',
          updatedAt: new Date()
        });
      }
    } else {
      // Payment Failed or Cancelled
      await paymentDoc.ref.update({
        paymentStatus: resultCode === 1032 ? 'cancelled' : 'failed',
        resultCode,
        resultDescription: resultDesc,
        updatedAt: new Date()
      });
    }

    // Safaricom expects a 200 response to acknowledge receipt
    res.status(200).json({ message: 'Callback processed successfully' });

  } catch (error) {
    console.error('Callback Error:', error);
    // Still return 200 to Safaricom so they stop retrying
    res.status(200).send('Error processing callback');
  }
};

module.exports = {
  initiateStkPush,
  handleCallback
};
