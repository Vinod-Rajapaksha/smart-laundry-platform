import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../../core/constants.js';

const onlineTransactionSchema = new mongoose.Schema(
    {
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
            required: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        gatewayOrderId: {
            type: String,
            required: true,
            trim: true,
        },
        gatewayPaymentId: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(PAYMENT_STATUS),
        },
        rawResponse: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('OnlineTransaction', onlineTransactionSchema);