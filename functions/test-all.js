const nodemailer = require('nodemailer');

const configsToTest = [
  { host: 'mail.alaturqa.co.ke', port: 465, secure: true, auth: { user: 'info@alaturqa.co.ke', pass: '!@Alaturqa2012#' } },
  { host: 'mail.alaturqa.co.ke', port: 587, secure: false, auth: { user: 'info@alaturqa.co.ke', pass: '!@Alaturqa2012#' } },
  { host: 'alaturqa.co.ke', port: 465, secure: true, auth: { user: 'info@alaturqa.co.ke', pass: '!@Alaturqa2012#' } },
  { host: 'mail.alaturqa.co.ke', port: 465, secure: true, auth: { user: 'info', pass: '!@Alaturqa2012#' } },
  { host: 'mail.alaturqa.co.ke', port: 465, secure: true, auth: { user: 'info+alaturqa.co.ke', pass: '!@Alaturqa2012#' } },
];

async function runTests() {
  for (let i = 0; i < configsToTest.length; i++) {
    const config = configsToTest[i];
    console.log(`\nTesting Config ${i + 1}:`, { host: config.host, port: config.port, secure: config.secure, user: config.auth.user });
    
    const transporter = nodemailer.createTransport({
      ...config,
      tls: { rejectUnauthorized: false },
      connectionTimeout: 5000
    });

    try {
      const success = await transporter.verify();
      if (success) {
        console.log(`✅ SUCCESS with Config ${i + 1}!`);
        return;
      }
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
    }
  }
}

runTests();
