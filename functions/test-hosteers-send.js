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
      to: 'aksan.kenya@gmail.com', // Sending to the email the user requested
      subject: "Test Order Receipt - Ala Turqa",
      text: "This is a test receipt from the new Ala Turqa backend. Hosteers SMTP is working!"
    });
    console.log("Test email sent! Message ID:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}

testEmail();
