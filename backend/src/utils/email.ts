import nodemailer from 'nodemailer';
import config from '../config/env.js';

export const sendLowStockEmail = async (
  supplierEmail: string, 
  supplierName: string, 
  itemName: string, 
  currentStock: number, 
  reorderLevel: number,
  supplierId: string,
  itemId: string
) => {
  // Generate ethereal account for testing so user can view email
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const confirmUrl = `${config.API_URL || 'http://localhost:5000'}/api/suppliers/confirm-restock?supplierId=${supplierId}&itemId=${itemId}`;
  
  const mailOptions = {
    from: '"Smart Laundry Admin" <admin@smartlaundry.com>',
    to: supplierEmail,
    subject: `Urgent: Restock Request for ${itemName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Restock Request</h2>
        <p>Dear ${supplierName},</p>
        <p>This is an automated alert from the Smart Laundry System. Our inventory for <strong>${itemName}</strong> has dropped below the required threshold.</p>
        <ul>
          <li><strong>Current Stock:</strong> ${currentStock}</li>
          <li><strong>Reorder Level:</strong> ${reorderLevel}</li>
        </ul>
        <p>Please kindly arrange for a new delivery of this item at your earliest convenience.</p>
        <p>To confirm that you have received this order and are processing it, please click the button below:</p>
        <br/>
        <a href="${confirmUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirm Restock</a>
        <br/><br/>
        <p>Thank you,</p>
        <p>Smart Laundry Management Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('==================================================');
    console.log('EMAIL PREVIEW URL: %s', nodemailer.getTestMessageUrl(info));
    console.log('==================================================');
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
