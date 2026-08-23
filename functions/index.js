const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
const router = express.Router();
router.use('/payment/mpesa', require('./routes/mpesaRoutes'));
router.get('/health', (req, res) => {
  res.json({ status: 'Ala Turqa API running' });
});

// Handle both Cloud Functions direct invocations (which strip /api) 
// and Firebase Hosting rewrites (which preserve /api)
app.use('/', router);
app.use('/api', router);

exports.api = functions.runWith({
  secrets: [
    "MPESA_CONSUMER_KEY",
    "MPESA_CONSUMER_SECRET",
    "MPESA_SHORTCODE",
    "MPESA_PASSKEY",
    "MPESA_TRANSACTION_TYPE",
    "MPESA_CALLBACK_URL",
    "MPESA_ENV"
  ]
}).https.onRequest(app);

const { admin, db } = require('./config/firebase');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'cp.hosteers.co.ke', // Confirmed Hosteers SMTP server
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

exports.onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const orderData = snap.data();
    const orderId = context.params.orderId;
    
    try {
      // 1. Create internal admin notification
      const notificationId = `notif-${orderId}`;
      const docRef = db.collection('notifications').doc(notificationId);
      
      const notificationData = {
        type: "NEW_ORDER",
        title: "New Order",
        message: `New order #${orderData.orderNumber || orderId} received`,
        orderId: orderId,
        orderNumber: orderData.orderNumber || orderId,
        recipientRole: "admin",
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await docRef.set(notificationData);
      console.log(`Notification created for order ${orderId}`);

      // 2. Send Email Receipt to Customer
      if (orderData.email) {
        let itemsHtml = '';
        (orderData.items || []).forEach(item => {
          itemsHtml += `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}x ${item.itemName}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">KES ${item.price * item.quantity}</td>
            </tr>
          `;
        });

        const mailOptions = {
          from: '"A La Turqa" <info@alaturqa.co.ke>',
          to: orderData.email,
          subject: `Order Confirmation - #${orderData.orderNumber || orderId}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #C9A227;">A La Turqa</h1>
                <h2>Thank you for your order!</h2>
                <p>Hi ${orderData.customerName}, your order has been received and is currently being processed.</p>
              </div>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <strong>Order #:</strong> ${orderData.orderNumber || orderId}<br>
                <strong>Delivery Method:</strong> ${orderData.deliveryMethod}<br>
                <strong>Payment Method:</strong> ${orderData.paymentMethod}
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Item</th>
                    <th style="text-align: right; padding: 10px; border-bottom: 2px solid #ddd;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                    <td style="padding: 10px; text-align: right;">KES ${orderData.subtotal}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; text-align: right; font-weight: bold;">Delivery Fee:</td>
                    <td style="padding: 10px; text-align: right;">KES ${orderData.deliveryFee}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.2em; color: #C9A227;">Total:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.2em; color: #C9A227;">KES ${orderData.total}</td>
                  </tr>
                </tfoot>
              </table>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://alaturqa.co.ke/track/${orderId}" style="background-color: #C9A227; color: #111; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Track Your Order</a>
              </div>
              
              <div style="text-align: center; margin-top: 30px; font-size: 0.9em; color: #777;">
                <p>If you have any questions, please contact us at info@alaturqa.co.ke</p>
              </div>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email receipt sent to ${orderData.email}`);
      }
    } catch (error) {
      console.error("Error processing order creation:", error);
    }
  });
