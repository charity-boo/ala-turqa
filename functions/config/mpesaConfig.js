require('dotenv').config();

const mpesaConfig = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  // Store Number (Head Office) — used as BusinessShortCode for Buy Goods
  // Sandbox universal shortcode: 174379
  storeNumber: process.env.MPESA_STORE_NUMBER || '174379',
  // Till Number — used as PartyB for Buy Goods (CustomerBuyGoodsOnline)
  tillNumber: process.env.MPESA_TILL_NUMBER || process.env.MPESA_SHORTCODE,
  // Legacy shortcode kept for backward compat (password generation uses storeNumber)
  shortcode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  transactionType: process.env.MPESA_TRANSACTION_TYPE ? process.env.MPESA_TRANSACTION_TYPE.trim() : 'CustomerBuyGoodsOnline',
  callbackUrl: process.env.MPESA_CALLBACK_URL ? process.env.MPESA_CALLBACK_URL.trim() : '',
  // Default env from secret; can be overridden at runtime via Firestore settings/mpesa doc
  env: process.env.MPESA_ENV || 'sandbox'
};

const getBaseUrl = (env) => {
  const effectiveEnv = env || mpesaConfig.env;
  return effectiveEnv === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
};

module.exports = {
  mpesaConfig,
  getBaseUrl
};
