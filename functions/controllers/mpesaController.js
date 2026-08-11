const mpesaService = require('../services/mpesaService');
const { db } = require('../config/firebase');
const { normalizePhoneNumber } = require('../utils/mpesaHelpers');

const initiateStkPush = async (req, res) => {
  try {
    const { orderId, phone, amount } = req.body;

    if (!orderId || !phone || !amount) {
      return res.status(400).json({ error: 'Missing required fields: orderId, phone, amount' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Add logging
    console.info(`[M-Pesa] STK Push request received for Order: ${orderId}, Amount: ${amount}`);

    // Call Daraja API
    const response = await mpesaService.sendStkPush(phone, amount, orderId);
    
    console.info(`[M-Pesa] STK Push initiated successfully. CheckoutRequestID: ${response.CheckoutRequestID}`);

    // Save transaction to Firestore
    const normalizedPhone = normalizePhoneNumber(phone);
    await db.collection('payments').add({
      orderId,
      amount: Number(amount),
      paymentMethod: 'mpesa',
      paymentStatus: 'pending',
      transactionReference: null,
      checkoutRequestId: response.CheckoutRequestID,
      createdAt: new Date(),
      updatedAt: new Date()
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
    const callbackData = req.body.Body.stkCallback;
    const checkoutRequestId = callbackData.CheckoutRequestID;
    const resultCode = callbackData.ResultCode;
    const resultDesc = callbackData.ResultDesc;

    // Find the payment document using checkoutRequestId
    const paymentsRef = db.collection('payments');
    const q = paymentsRef.where('checkoutRequestId', '==', checkoutRequestId).limit(1);
    const snapshot = await q.get();
    
    console.info(`[M-Pesa] Callback received. CheckoutRequestID: ${checkoutRequestId}, ResultCode: ${resultCode}`);

    if (snapshot.empty) {
      console.warn(`[M-Pesa] Callback received for unknown checkoutRequestId: ${checkoutRequestId}`);
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
          paymentMethod: 'mpesa',
          updatedAt: new Date()
        });
        console.info(`[M-Pesa] Payment marked as SUCCESS in Firestore for Order: ${orderId}`);
      }
    } else {
      // Payment Failed or Cancelled
      await paymentDoc.ref.update({
        paymentStatus: resultCode === 1032 ? 'cancelled' : 'failed',
        resultCode,
        resultDescription: resultDesc,
        updatedAt: new Date()
      });
      console.warn(`[M-Pesa] Payment marked as FAILED in Firestore for Order: ${orderId}. Reason: ${resultDesc}`);
    }

    // Safaricom expects a 200 response to acknowledge receipt
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
