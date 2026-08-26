const nodemailer = require('nodemailer');

async function testGmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL || 'test@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'test-password'
    }
  });

  try {
    const success = await transporter.verify();
    if (success) {
      console.log("Connection to Gmail verified successfully!");
    }
  } catch (error) {
    console.error("Error connecting to Gmail:", error.message);
  }
}

testGmail();
