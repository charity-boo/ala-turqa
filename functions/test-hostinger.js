const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, 
    auth: {
      user: 'info@alaturqa.co.ke',
      pass: '!@Alaturqa2012#'
    }
  });

  try {
    console.log("Verifying connection to smtp.hostinger.com on port 465...");
    const success = await transporter.verify();
    if (success) {
      console.log("Connection verified successfully!");
      return;
    }
  } catch (error) {
    console.error("Error on port 465:", error.message);
  }
}

testEmail();
