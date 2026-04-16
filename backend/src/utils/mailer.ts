import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendLowStockEmail = async (supplierEmail: string, itemName: string, quantityRequired: string) => {
    const mailOptions = {
        from: `"Smart Laundry Inventory" <${process.env.SMTP_USER}>`,
        to: supplierEmail,
        subject: `Low Stock Alert: ${itemName}`,
        text: `The stock for ${itemName} is low. Required quantity to restock: ${quantityRequired}.`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #d32f2f;">Low Stock Alert</h2>
                <p>Hello,</p>
                <p>The inventory level for <strong>${itemName}</strong> has fallen below the threshold.</p>
                <p><strong>Quantity Required:</strong> ${quantityRequired}</p>
                <p>Please arrange for a restock as soon as possible.</p>
                <br/>
                <p>Best Regards,</p>
                <p>Smart Laundry Management Team</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Low stock email sent to ${supplierEmail} for item ${itemName}`);
    } catch (error) {
        console.error('Error sending low stock email:', error);
    }
};
