const axios = require('axios');
const { mpesaConfig, getBaseUrl } = require('../config/mpesaConfig');
const { getTimestamp, generatePassword, normalizePhoneNumber } = require('../utils/mpesaHelpers');

class MpesaService {
  async getAccessToken() {
    const { consumerKey, consumerSecret } = mpesaConfig;
    const url = `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${auth}`
        }
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error?.response?.data || error.message);
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  async sendStkPush(phone, amount, orderId) {
    const accessToken = await this.getAccessToken();
    const url = `${getBaseUrl()}/mpesa/stkpush/v1/processrequest`;
    
    const timestamp = getTimestamp();
    const password = generatePassword(mpesaConfig.shortcode, mpesaConfig.passkey, timestamp);
    const normalizedPhone = normalizePhoneNumber(phone);

    const data = {
      BusinessShortCode: mpesaConfig.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: mpesaConfig.transactionType || "CustomerPayBillOnline", // Supports both PayBill and BuyGoods
      Amount: Math.ceil(amount),
      PartyA: normalizedPhone,
      PartyB: mpesaConfig.shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: mpesaConfig.callbackUrl,
      AccountReference: orderId.substring(0, 12),
      TransactionDesc: `Payment for order ${orderId}`
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error initiating STK push:', error?.response?.data || error.message);
      throw new Error(error?.response?.data?.errorMessage || 'Failed to initiate STK push');
    }
  }
}

module.exports = new MpesaService();
