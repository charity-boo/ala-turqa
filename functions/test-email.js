const nodemailer = require('nodemailer');
require('dotenv').config(); // Allows testing with a local .env file

async function testEmail() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const email = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!email || !password) {
    console.error("❌ ERROR: SMTP_USER and SMTP_PASSWORD environment variables are required.");
    console.log("Please export them in your terminal.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: true,
    auth: {
      user: email,
      pass: password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log(`Verifying connection to ${host} on port ${port} for ${email}...`);
    const success = await transporter.verify();
    if (success) {
      console.log("✅ Connection verified successfully! SMTP is ready.");
    }
  } catch (error) {
    console.error(`❌ Error connecting to ${host}:`, error.message);
    if (error.message.includes('Invalid login')) {
      console.log("HINT: Ensure you are using the correct password or an 'App Password' if using Gmail.");
    }
  }
}

testEmail();
