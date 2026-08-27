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

router.get('/tracking/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    let orderDoc = await db.collection('orders').doc(orderId).get();
    
    if (!orderDoc.exists) {
      const snap = await db.collection('orders').where('publicTrackingId', '==', orderId).limit(1).get();
      if (!snap.empty) {
        orderDoc = snap.docs[0];
      }
    }

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const data = orderDoc.data();
    res.json({
      id: orderDoc.id,
      orderNumber: data.orderNumber || orderDoc.id.slice(-6).toUpperCase(),
      customerName: data.customerName || data.name || 'Valued Customer',
      status: data.orderStatus || data.status || 'new',
      deliveryMethod: data.deliveryMethod || 'Delivery',
      deliveryProvider: data.deliveryProvider || '',
      paymentMethod: data.paymentMethod || 'M-Pesa',
      paymentStatus: data.paymentStatus || 'pending',
      mpesaReceiptNumber: data.mpesaReceiptNumber || null,
      total: data.total || data.totalAmount || 0,
      createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt) : new Date()
    });
  } catch (err) {
    console.error('Error fetching tracking data:', err);
    res.status(500).json({ error: 'Failed to retrieve tracking data' });
  }
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
    "MPESA_ENV",
    "MPESA_STORE_NUMBER",
    "MPESA_TILL_NUMBER"
  ]
}).https.onRequest(app);

const { admin, db } = require('./config/firebase');
const nodemailer = require('nodemailer');


exports.onOrderCreated = functions.runWith({
  secrets: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD"]
}).firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const orderData = snap.data();
    const orderId = context.params.orderId;
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

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
        console.log(`[Email] Preparing receipt for order ${orderId} to ${orderData.email}...`);
        
        try {
          console.log(`[Email] Verifying SMTP connection...`);
          await transporter.verify();
          console.log(`[Email] SMTP connection verified successfully.`);
        } catch (vErr) {
          console.error(`[Email] SMTP connection failed: ${vErr.message}`);
          throw vErr;
        }

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
          from: `"A La Turqa" <${process.env.SMTP_USER}>`,
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
                <a href="${process.env.FRONTEND_URL || 'https://alaturqa.co.ke'}/track/${orderData.publicTrackingId}" style="background-color: #C9A227; color: #111; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Track Your Order</a>
              </div>
              
              <div style="text-align: center; margin-top: 30px; font-size: 0.9em; color: #777;">
                <p>If you have any questions, please contact us at info@alaturqa.co.ke</p>
              </div>
            </div>
          `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email] Receipt successfully sent to ${orderData.email}. Message ID: ${info.messageId}`);
      } else {
        console.log(`[Email] No email provided by customer for order ${orderId}. Skipping email receipt.`);
      }
    } catch (error) {
      console.error(`[Order Trigger] Error processing order ${orderId}:`, error.message);
    }
  });

function generateOrderStatusEmail({ customerName, orderNumber, status, orderData, trackingUrl }) {
  let subject = '';
  let heading = '';
  let message = '';

  switch(status) {
    case 'preparing':
      subject = "Your Ala Turqa Order is Being Prepared";
      heading = "We're preparing your order!";
      message = `Hi ${customerName}, your order #${orderNumber} is now being prepared by our chefs. It will be ready soon.`;
      break;
    case 'ready':
      subject = "Your Ala Turqa Order is Ready";
      heading = "Your order is ready!";
      message = `Hi ${customerName}, your order #${orderNumber} is ready! ` + 
                (orderData.deliveryMethod === 'pickup' || orderData.orderType === 'pickup'
                  ? "You can now collect it from our restaurant." 
                  : "It is ready for dispatch and will be on its way shortly.");
      break;
    case 'out_for_delivery':
      subject = "Your Ala Turqa Order is On the Way";
      heading = "Your order is on the way!";
      message = `Hi ${customerName}, your order #${orderNumber} is out for delivery. Our rider is on the way.`;
      break;
    case 'completed':
      subject = "Your Ala Turqa Order is Complete";
      heading = "Order Completed";
      message = `Hi ${customerName}, your order #${orderNumber} has been completed. Thank you for dining with A La Turqa!`;
      break;
    case 'cancelled':
      subject = "Your Ala Turqa Order Has Been Cancelled";
      heading = "Order Cancelled";
      message = `Hi ${customerName}, your order #${orderNumber} has been cancelled. If you have any questions, please contact us.`;
      break;
    default:
      return null;
  }

  return {
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #C9A227;">A La Turqa</h1>
          <h2>${heading}</h2>
          <p>${message}</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <strong>Order #:</strong> ${orderNumber}<br>
          <strong>Total:</strong> KES ${orderData.total || orderData.totalAmount}<br>
          <strong>Current Status:</strong> <span style="text-transform: capitalize;">${status.replace(/_/g, ' ')}</span>
        </div>

        ${trackingUrl ? `
        <div style="text-align: center; margin-top: 30px;">
          <a href="${trackingUrl}" style="background-color: #C9A227; color: #111; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Track Your Order</a>
        </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 30px; font-size: 0.9em; color: #777;">
          <p>If you have any questions, please contact us at info@alaturqa.co.ke or call 0140628102.</p>
        </div>
      </div>
    `
  };
}

exports.onOrderStatusUpdated = functions.runWith({
  secrets: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD"]
}).firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const orderId = context.params.orderId;

    const beforeStatus = beforeData.status || 'pending';
    const afterStatus = afterData.status || 'pending';

    // Only proceed if fulfillment status actually changed
    if (beforeStatus === afterStatus) {
      return null;
    }

    const validStatuses = ['preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'];
    if (!validStatuses.includes(afterStatus)) {
      return null;
    }

    if (!afterData.email) {
      console.log(`[Email] No customer email. Skipping status notification.`);
      return null;
    }

    // Idempotency check: prevent sending duplicate emails for the same status
    const emailNotifications = afterData.emailNotifications || {};
    if (emailNotifications[afterStatus]) {
      console.log(`[OrderStatusEmail] Email for status ${afterStatus} already sent for order ${orderId}. Skipping.`);
      return null;
    }

    console.log(`[OrderStatusEmail] Order: ${orderId} | Previous: ${beforeStatus} | Current: ${afterStatus} | Recipient: ${afterData.email}`);

    const trackingUrl = afterData.publicTrackingId 
      ? `${process.env.FRONTEND_URL || 'https://alaturqa.co.ke'}/track/${afterData.publicTrackingId}` 
      : null;
      
    const orderNumber = afterData.orderNumber || orderId;
    const customerName = afterData.customerName || `${afterData.firstName || ''} ${afterData.lastName || ''}`.trim() || 'Customer';

    const emailTemplate = generateOrderStatusEmail({
      customerName,
      orderNumber,
      status: afterStatus,
      orderData: afterData,
      trackingUrl
    });

    if (!emailTemplate) return null;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    try {
      const mailOptions = {
        from: `"A La Turqa" <${process.env.SMTP_USER}>`,
        to: afterData.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[OrderStatusEmail] Order: ${orderId} | Status: ${afterStatus} | Result: sent | MessageId: ${info.messageId}`);

      // Mark email as successfully sent for this status
      await db.collection('orders').doc(orderId).update({
        [`emailNotifications.${afterStatus}`]: true
      });

    } catch (error) {
      console.error(`[OrderStatusEmail] Order: ${orderId} | Status: ${afterStatus} | Result: failed | Error: ${error.message}`);
      // Re-throw to allow Cloud Functions to retry safely (if retry is configured)
      throw error;
    }
});
