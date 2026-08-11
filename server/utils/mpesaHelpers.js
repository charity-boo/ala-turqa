const normalizePhoneNumber = (phone) => {
  let normalized = phone.replace(/[^0-9]/g, '');
  
  if (normalized.startsWith('0')) {
    normalized = '254' + normalized.substring(1);
  } else if (normalized.startsWith('254')) {
    // already properly formatted
  } else if (normalized.startsWith('1')) {
    // Some Kenyan numbers start with 01, which becomes 1 after stripping 0 if it was missed, or just 1
    normalized = '254' + normalized;
  } else {
    // default fallback, assuming it's a kenyan number missing the prefix
    normalized = '254' + normalized;
  }
  
  return normalized;
};

const getTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const generatePassword = (shortcode, passkey, timestamp) => {
  const stringToEncode = shortcode + passkey + timestamp;
  return Buffer.from(stringToEncode).toString('base64');
};

const generatePaymentNumber = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PAY-${yyyy}${mm}${dd}-${random}`;
};

module.exports = {
  normalizePhoneNumber,
  getTimestamp,
  generatePassword,
  generatePaymentNumber
};
