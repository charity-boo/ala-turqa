import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Initiates an M-Pesa STK Push
 */
export const initiateStkPush = async (orderId, phone, amount) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/mpesa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, phone, amount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to initiate STK push');
    }

    return await response.json();
  } catch (error) {
    console.error('STK Push Request Error:', error);
    throw error;
  }
};

/**
 * Polls the payment status from Firestore
 * Resolves when payment is successful, rejects if failed or cancelled.
 */
export const pollPaymentStatus = (checkoutRequestId, onStatusChange) => {
  return new Promise((resolve, reject) => {
    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, where('checkoutRequestId', '==', checkoutRequestId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const paymentDoc = snapshot.docs[0].data();
        
        if (onStatusChange) {
          onStatusChange(paymentDoc.paymentStatus);
        }

        if (paymentDoc.paymentStatus === 'completed') {
          unsubscribe();
          resolve(paymentDoc);
        } else if (paymentDoc.paymentStatus === 'failed' || paymentDoc.paymentStatus === 'cancelled') {
          unsubscribe();
          reject(new Error(paymentDoc.resultDescription || 'Payment failed or was cancelled.'));
        }
        // If pending, keep waiting...
      }
    }, (error) => {
      unsubscribe();
      reject(error);
    });
  });
};
