import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Testing SMTP with:');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);
console.log('Pass Length:', process.env.SMTP_PASS?.length || 0);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function test() {
    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful');
        
        console.log('Sending test email...');
        await transporter.sendMail({
            from: `"Smart Laundry Test" <${process.env.SMTP_USER}>`,
            to: 'hello.malindu@gmail.com', // User's requested email
            subject: 'Test Email - Smart Laundry Platform',
            text: 'This is a test email sent to hello.malindu@gmail.com. If you received this, your SMTP configuration is working perfectly for external recipients!'
        });
        console.log('✅ Test email sent to hello.malindu@gmail.com');
    } catch (error) {
        console.error('❌ SMTP Error:', error);
    }
}

test();
