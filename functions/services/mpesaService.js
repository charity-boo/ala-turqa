const axios = require('axios');
const { mpesaConfig, getBaseUrl } = require('../config/mpesaConfig');
const { getTimestamp, generatePassword, normalizePhoneNumber } = require('../utils/mpesaHelpers');

class MpesaService {
  /**
   * Get OAuth access token from Daraja API
   * @param {string} [envOverride] - Optional env override ('sandbox' | 'production')
   */
  async getAccessToken(envOverride) {
    const { consumerKey, consumerSecret } = mpesaConfig;
    const url = `${getBaseUrl(envOverride)}/oauth/v1/generate?grant_type=client_credentials`;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${auth}`
        }
      });
      console.info('[M-Pesa] Daraja authentication successful');
      return response.data.access_token;
    } catch (error) {
      console.error('[M-Pesa] Daraja authentication failed:', error.message);
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  /**
   * Initiate an STK Push (Lipa Na M-Pesa Online)
   * For Buy Goods (Till):
   *   - BusinessShortCode = Store Number (Head Office)
   *   - PartyB = Till Number
   *   - Password = Base64(StoreNumber + Passkey + Timestamp)
   * 
   * @param {string} phone - Customer phone number
   * @param {number} amount - Amount in KES
   * @param {string} orderId - Order reference
   * @param {string} [envOverride] - Optional env override ('sandbox' | 'production')
   */
  async sendStkPush(phone, amount, orderId, envOverride) {
    const accessToken = await this.getAccessToken(envOverride);
    const url = `${getBaseUrl(envOverride)}/mpesa/stkpush/v1/processrequest`;
    
    const timestamp = getTimestamp();
    // For Buy Goods: password uses the Store Number (Head Office shortcode), NOT the Till Number
    const businessShortCode = mpesaConfig.storeNumber;
    const password = generatePassword(businessShortCode, mpesaConfig.passkey, timestamp);
    const normalizedPhone = normalizePhoneNumber(phone);

    const isBuyGoods = (mpesaConfig.transactionType || '').includes('BuyGoods');

    const data = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: mpesaConfig.transactionType,
      Amount: Math.ceil(amount),
      PartyA: normalizedPhone,
      // For Buy Goods: PartyB is the Till Number
      // For PayBill: PartyB is the same as BusinessShortCode
      PartyB: isBuyGoods ? mpesaConfig.tillNumber : businessShortCode,
      PhoneNumber: normalizedPhone,
      CallBackURL: mpesaConfig.callbackUrl,
      AccountReference: orderId.substring(0, 12),
      TransactionDesc: `Payment for order ${orderId}`
    };

    console.info(`[M-Pesa] STK Push request — Env: ${envOverride || mpesaConfig.env}, Type: ${data.TransactionType}, BusinessShortCode: ${data.BusinessShortCode}, PartyB: ${data.PartyB}`);

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('[M-Pesa] Error initiating STK push:', error.message);
      if (error?.response?.data) {
        console.error('[M-Pesa] Daraja error response:', JSON.stringify(error.response.data));
      }
      throw new Error(error?.response?.data?.errorMessage || 'Failed to initiate STK push');
    }
  }
}

module.exports = new MpesaService();
