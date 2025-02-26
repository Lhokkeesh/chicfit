import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set in environment variables');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail(data: EmailData) {
  try {
    await sgMail.send({
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@chicfit.com',
      ...data,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export const emailTemplates = {
  orderConfirmation: (order: any) => ({
    subject: `Order Confirmation #${order._id}`,
    text: `Thank you for your order! Your order #${order._id} has been confirmed.`,
    html: `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <p>Order #: ${order._id}</p>
      <p>Total: $${order.totalAmount.toFixed(2)}</p>
      <h2>Items:</h2>
      <ul>
        ${order.items.map((item: any) => `
          <li>
            ${item.product.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
          </li>
        `).join('')}
      </ul>
    `,
  }),

  orderStatusUpdate: (order: any) => ({
    subject: `Order Status Update #${order._id}`,
    text: `Your order #${order._id} status has been updated to ${order.status}.`,
    html: `
      <h1>Order Status Update</h1>
      <p>Your order #${order._id} has been updated.</p>
      <p>New Status: ${order.status}</p>
      <p>Track your order here: <a href="${process.env.NEXT_PUBLIC_URL}/orders/${order._id}">View Order</a></p>
    `,
  }),

  passwordReset: (token: string) => ({
    subject: 'Password Reset Request',
    text: `Click this link to reset your password: ${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`,
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the button below to reset your password:</p>
      <a href="${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}" 
         style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
    `,
  }),
}; 