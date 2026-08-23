const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'cp.hosteers.co.ke',
    port: 465,
    secure: true, 
    auth: {
      user: 'info@alaturqa.co.ke',
      pass: '!@Alaturqa2012#'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Verifying connection to cp.hosteers.co.ke on port 465...");
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
