require('dotenv').config();

const mpesaConfig = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortcode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  transactionType: process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline',
  callbackUrl: process.env.MPESA_CALLBACK_URL,
  env: process.env.MPESA_ENV || 'sandbox'
};

const getBaseUrl = () => {
  return mpesaConfig.env === 'production' 
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
};

module.exports = {
  mpesaConfig,
  getBaseUrl
};
