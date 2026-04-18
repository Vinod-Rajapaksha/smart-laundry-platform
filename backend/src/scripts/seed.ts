import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, closeDB } from '../config/db.js';
import logger from '../config/logger.js';
import { PAYMENT_METHODS, PAYMENT_STATUS, ORDER_STATUS, LOYALTY_TIER_NAME, DISCOUNT_TYPE, VOUCHER_TYPE, FEEDBACK_STATUS } from '../core/constants.js';

// Import Models
import User from '../database/models/User.js';
import ServiceCategory from '../database/models/ServiceCategory.js';
import Service from '../database/models/Service.js';
import Order from '../database/models/Order.js';
import Payment from '../database/models/Payment.js';
import SavedCard from '../database/models/SavedCard.js';
import Inventory from '../database/models/Inventory.js';
import LoyaltyTier from '../database/models/LoyaltyTier.js';
import Voucher from '../database/models/Voucher.js';
import Feedback from '../database/models/Feedback.js';
import Notification from '../database/models/Notification.js';
import StaffJob from '../database/models/StaffJob.js';
import QRCode from '../database/models/QRCode.js';
import Revenue from '../database/models/Revenue.js';
import Expense from '../database/models/Expense.js';
import CustomerLoyalty from '../database/models/CustomerLoyalty.js';
import LoyaltyTransaction from '../database/models/LoyaltyTransaction.js';
import VoucherRedemption from '../database/models/VoucherRedemption.js';
import Report from '../database/models/Report.js';
import OnlineTransaction from '../database/models/OnlineTransaction.js';

const seed = async () => {
    try {
        await connectDB();
        logger.info('Starting seeding process...');

        const password = await bcrypt.hash('password123', 10);

        // Helper for Upsert
        const upsertUser = async (data: any) => {
            return await User.findOneAndUpdate({ email: data.email }, data, { upsert: true, new: true, returnDocument: 'after' });
        };
        const upsertCategory = async (data: any) => {
            return await ServiceCategory.findOneAndUpdate({ name: data.name }, data, { upsert: true, new: true, returnDocument: 'after' });
        };
        const upsertService = async (data: any) => {
            return await Service.findOneAndUpdate({ name: data.name, categoryId: data.categoryId }, data, { upsert: true, new: true, returnDocument: 'after' });
        };

        // 1. Seed Users
        logger.info('Seeding Users...');
        const admin = await upsertUser({ name: 'Admin User', email: 'admin@laundry.com', password, telephone: '0711234560', role: 'ADMIN' });
        const staffStore = await upsertUser({ name: 'Store Staff', email: 'store@laundry.com', password, telephone: '0711234561', role: 'STAFF', staffType: 'STORE' });
        const staffDelivery = await upsertUser({ name: 'Delivery Rider', email: 'rider@laundry.com', password, telephone: '0711234562', role: 'STAFF', staffType: 'DELIVERY' });
        const customer1 = await upsertUser({ name: 'John Customer', email: 'john@gmail.com', password, telephone: '0711234563', role: 'CUSTOMER', address: '123 Main St, Colombo' });
        const customer2 = await upsertUser({ name: 'Jane Customer', email: 'jane@gmail.com', password, telephone: '0711234564', role: 'CUSTOMER', address: '456 Side St, Kandy' });

        // 2. Seed Service Categories
        logger.info('Seeding Service Categories...');
        const cat1 = await upsertCategory({ name: 'Wash & Fold', price: 15.00 });
        const cat2 = await upsertCategory({ name: 'Dry Clean', price: 0 });
        const cat3 = await upsertCategory({ name: 'Ironing Only', price: 10.00 });

        // 3. Seed Services
        logger.info('Seeding Services...');
        const srv1 = await upsertService({ categoryId: cat1._id, name: 'Normal Wash (kg)', price: 350 });
        const srv2 = await upsertService({ categoryId: cat1._id, name: 'Heavy Load (kg)', price: 500 });
        const srv3 = await upsertService({ categoryId: cat2._id, name: 'Suit (Full)', price: 1200 });
        const srv4 = await upsertService({ categoryId: cat2._id, name: 'Wedding Dress', price: 5000 });
        const srv5 = await upsertService({ categoryId: cat3._id, name: 'Shirt Press', price: 80 });

        // 4. Seed Loyalty Tiers
        logger.info('Seeding Loyalty Tiers...');
        const tierData = [
            { name: LOYALTY_TIER_NAME.SILVER, minPoints: 1000, rewardRate: 0.03 },
            { name: LOYALTY_TIER_NAME.GOLD, minPoints: 5000, rewardRate: 0.05 },
            { name: LOYALTY_TIER_NAME.PLATINUM, minPoints: 10000, rewardRate: 0.10 },
        ];
        const tierDocs = [];
        for (const t of tierData) {
            tierDocs.push(await LoyaltyTier.findOneAndUpdate({ name: t.name }, t, { upsert: true, new: true, returnDocument: 'after' }));
        }

        // 5. Seed Inventory
        logger.info('Seeding Inventory...');
        const inventoryItems = [
            { name: 'Premium Liquid Detergent', categoryName: 'DETERGENT', qtyInStock: 50, unit: 'L', reorderLevel: 10, unitPrice: 200, sku: 'DET-001', itemId: 'INV-001' },
            { name: 'Softener - Lavender', categoryName: 'SOFTENER', qtyInStock: 20, unit: 'L', reorderLevel: 5, unitPrice: 150, sku: 'SOFT-001', itemId: 'INV-002' },
            { name: 'Plastic Hangers', categoryName: 'PACKAGING', qtyInStock: 500, unit: 'PCS', reorderLevel: 50, unitPrice: 10, sku: 'HANG-001', itemId: 'INV-003' },
        ];
        for (const item of inventoryItems) {
            await Inventory.findOneAndUpdate({ name: item.name }, item, { upsert: true });
        }

        // 6. Seed Vouchers
        logger.info('Seeding Vouchers...');
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2026-12-31');
        const v1 = await Voucher.findOneAndUpdate({ code: 'WELCOME50' }, { 
            code: 'WELCOME50', 
            voucherType: VOUCHER_TYPE.PUBLIC, 
            discountType: DISCOUNT_TYPE.FIXED, 
            discountValue: 50, 
            minOrderAmount: 500, 
            startDate, endDate, isActive: true 
        }, { upsert: true, new: true, returnDocument: 'after' });
        const v2 = await Voucher.findOneAndUpdate({ code: 'SAVE20' }, { 
            code: 'SAVE20', 
            voucherType: VOUCHER_TYPE.SEASONAL, 
            discountType: DISCOUNT_TYPE.PERCENTAGE, 
            discountValue: 20, 
            minOrderAmount: 1000, 
            startDate, endDate, isActive: true 
        }, { upsert: true, new: true, returnDocument: 'after' });

        // 7. Seed Orders
        logger.info('Seeding Orders...');
        const ts = Date.now();
        const orders = await Order.insertMany([
            {
                orderNo: 'ORD-1001-' + ts,
                userId: customer1._id,
                serviceId: srv1._id,
                weightKg: 5,
                status: ORDER_STATUS.DELIVERED,
                reservedDateTime: new Date(),
                subtotal: 1750,
                totalAmount: 1750,
                paymentMethod: PAYMENT_METHODS.COD,
                paymentStatus: PAYMENT_STATUS.PAID
            },
            {
                orderNo: 'ORD-1002-' + ts,
                userId: customer2._id,
                serviceId: srv3._id,
                status: ORDER_STATUS.PROCESSING,
                reservedDateTime: new Date(),
                subtotal: 1200,
                totalAmount: 1200,
                paymentMethod: PAYMENT_METHODS.CARD,
                paymentStatus: PAYMENT_STATUS.PAID
            },
            {
                orderNo: 'ORD-1003-' + ts,
                userId: customer1._id,
                serviceId: srv5._id,
                status: ORDER_STATUS.ORDER_PLACED,
                reservedDateTime: new Date(),
                subtotal: 80,
                totalAmount: 80,
                paymentMethod: PAYMENT_METHODS.COD,
                paymentStatus: PAYMENT_STATUS.PENDING
            }
        ]);

        // 8. Seed Payments
        logger.info('Seeding Payments...');
        const payments = await Payment.insertMany([
            { orderId: orders[0]._id, userId: customer1._id, amount: 1750, method: PAYMENT_METHODS.COD, status: PAYMENT_STATUS.PAID, paidAt: new Date() },
            { orderId: orders[1]._id, userId: customer2._id, amount: 1200, method: PAYMENT_METHODS.CARD, status: PAYMENT_STATUS.PAID, paidAt: new Date() },
        ]);

        // 9. Seed SavedCards
        logger.info('Seeding SavedCards...');
        await SavedCard.insertMany([
            { userId: customer1._id, cardToken: 'tok_visa_' + ts, last4: '4242', brand: 'Visa', provider: 'PayHere', isDefault: true, expiryMonth: 12, expiryYear: 2030 },
            { userId: customer2._id, cardToken: 'tok_master_' + ts, last4: '8890', brand: 'Mastercard', provider: 'PayHere', isDefault: false, expiryMonth: 11, expiryYear: 2029 },
        ]);

        // 10. Seed StaffJobs
        logger.info('Seeding StaffJobs...');
        await StaffJob.insertMany([
            { orderId: orders[0]._id, assignedStaffId: staffStore._id, jobType: 'WASHING', jobStatus: 'COMPLETED', startedAt: new Date(), completedAt: new Date() },
            { orderId: orders[1]._id, assignedStaffId: staffDelivery._id, jobType: 'PICKUP', jobStatus: 'IN_PROGRESS', startedAt: new Date() },
        ]);

        // 11. Seed Feedback
        logger.info('Seeding Feedback...');
        await Feedback.create({
            orderId: orders[0]._id,
            userId: customer1._id,
            rating: 5,
            status: FEEDBACK_STATUS.APPROVED,
            comment: 'Excellent service, garments are very clean!'
        });

        // 12. Seed Notifications
        logger.info('Seeding Notifications...');
        await Notification.insertMany([
            { userId: customer1._id, title: 'Welcome to Smart Laundry', message: 'Thank you for joining our platform!', type: 'SYSTEM' },
            { userId: customer2._id, title: 'Order Update', message: 'Your laundry is being processed.', type: 'ORDER_UPDATE' },
        ]);

        // 13. Seed Loyalty Data
        logger.info('Seeding Loyalty Data...');
        const loyalty1 = await CustomerLoyalty.findOneAndUpdate(
            { userId: customer1._id },
            { tierId: tierDocs[0]._id, totalPoints: 175, lifetimePoints: 175 },
            { upsert: true, new: true, returnDocument: 'after' }
        );
        await LoyaltyTransaction.create({
            loyaltyId: loyalty1._id,
            points: 175,
            type: 'EARNED',
        });

        // 14. Seed QRCodes
        logger.info('Seeding QRCodes...');
        await QRCode.findOneAndUpdate(
            { orderId: orders[0]._id },
            { 
                userId: customer1._id, 
                codeId: 'QR_CODE_' + orders[0]._id, 
                isUsed: true, 
                usedAt: new Date(), 
                expiresAt: new Date('2026-01-01') 
            },
            { upsert: true }
        );

        // 15. Seed Financial Data
        logger.info('Seeding Financial Data...');
        await Revenue.create({ name: 'March Sales', amount: 2950, sourceType: 'ORDERS', date: new Date() });
        await Expense.create({ name: 'Inventory Replenishment', amount: 500, date: new Date() });

        // 16. Seed Reports
        logger.info('Seeding Reports...');
        await Report.findOneAndUpdate({ reportType: 'MONTHLY_SALES' }, {
            reportCode: 'REP-' + Date.now(),
            reportType: 'MONTHLY_SALES',
            periodFrom: new Date('2024-03-01'),
            periodTo: new Date('2024-03-31'),
            generatedBy: admin._id,
        }, { upsert: true });

        // 17. Seed Voucher Redemptions
        logger.info('Seeding Voucher Redemptions...');
        await VoucherRedemption.create({
            voucherId: v1._id,
            userId: customer1._id,
            orderId: orders[0]._id,
            discountAmount: 50,
            redeemedAt: new Date()
        });

        // 18. Seed Online Transactions
        logger.info('Seeding Online Transactions...');
        await OnlineTransaction.create({
            paymentId: payments[1]._id,
            gatewayOrderId: 'G_ORDER_' + ts,
            gatewayPaymentId: 'G_PAY_' + ts,
            status: PAYMENT_STATUS.PAID,
            rawResponse: { message: 'Success from Gateway' }
        });

        logger.info('Seeding completed successfully!');
    } catch (err) {
        logger.error('Error during seeding:');
        logger.error(err);
    } finally {
        await closeDB();
    }
};

seed();
