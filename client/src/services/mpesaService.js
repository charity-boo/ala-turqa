import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Initiates an M-Pesa STK Push
 */
export const initiateStkPush = async (orderId, phone, amount) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/payment/mpesa`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ orderId, phone, amount }),
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      let errorMessage = `Payment request failed (${response.status})`;
      if (isJson) {
        const errorData = await response.json().catch(() => ({}));
        errorMessage = errorData.error || errorData.message || errorMessage;
      } else {
        const text = await response.text().catch(() => '');
        console.error('[M-Pesa Service] Non-JSON error response from server:', text);
        errorMessage = `Payment backend unavailable (${response.status}). Please try again or contact support.`;
      }
      throw new Error(errorMessage);
    }

    if (isJson) {
      return await response.json();
    } else {
      throw new Error('Invalid response format from payment server');
    }
  } catch (error) {
    console.error('STK Push Request Error:', error);
    throw error;
  }
};

/**
 * Polls the payment status from Firestore
 * Resolves when payment is successful, rejects if failed or cancelled.
 */
export const pollPaymentStatus = (checkoutRequestId, onStatusChange, timeoutMs = 180000, signal = null) => {
  return new Promise((resolve, reject) => {
    let timeoutId;
    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, where('checkoutRequestId', '==', checkoutRequestId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const paymentDoc = snapshot.docs[0].data();
        
        if (onStatusChange) {
          onStatusChange(paymentDoc.status);
        }

        if (['completed', 'failed', 'cancelled'].includes(paymentDoc.status)) {
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(paymentDoc);
        }
        // If pending, keep waiting...
      }
    }, (error) => {
      clearTimeout(timeoutId);
      unsubscribe();
      if (signal?.aborted) return;
      reject(error);
    });

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        unsubscribe();
        const abortError = new Error('ABORTED');
        abortError.code = 'ABORTED';
        reject(abortError);
      });
    }

    // Timeout mechanism - 3 minute timeout
    timeoutId = setTimeout(() => {
      unsubscribe();
      const timeoutError = new Error('TIMEOUT');
      timeoutError.code = 'TIMEOUT';
      reject(timeoutError);
    }, timeoutMs);
  });
};
