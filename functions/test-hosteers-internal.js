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
    const info = await transporter.sendMail({
      from: '"A La Turqa" <info@alaturqa.co.ke>',
      to: 'info@alaturqa.co.ke', // Send it to itself to bypass Gmail spam filters
      subject: "Test Order Receipt - Ala Turqa INTERNAL",
      text: "This is a test receipt from the new Ala Turqa backend. Hosteers SMTP is working internally!"
    });
    console.log("Internal test email sent! Message ID:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}

testEmail();
