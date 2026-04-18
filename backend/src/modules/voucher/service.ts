import Voucher from '../../database/models/Voucher.js';
import VoucherRedemption from '../../database/models/VoucherRedemption.js';
import Order from '../../database/models/Order.js';
import ApiError from '../../core/apiError.js';

export const createVoucher = async (data: any) => {
  return Voucher.create(data);
};

export const getAllVouchers = async (filter: any = {}) => {
  return Voucher.find(filter).sort({ createdAt: -1 });
};

export const getVoucherByCode = async (code: string) => {
  const voucher = await Voucher.findOne({ code, isActive: true });
  if (!voucher) {
    throw new ApiError(404, 'Voucher not found or inactive');
  }
  return voucher;
};

export const validateVoucher = async (code: string, userId: string, orderAmount: number) => {
  const voucher = await Voucher.findOne({ code, isActive: true });
  if (!voucher) {
    throw new ApiError(404, 'Voucher not found or inactive');
  }

  // Date validation
  const now = new Date();
  if (now < voucher.startDate || now > voucher.endDate) {
    throw new ApiError(400, 'Voucher is not valid at this time');
  }

  // Min amount validation
  if (orderAmount < voucher.minOrderAmount) {
    throw new ApiError(400, `Minimum order amount for this voucher is LKR ${voucher.minOrderAmount}`);
  }

  // Total usage limit
  if (voucher.usageLimitTotal) {
    const totalUses = await VoucherRedemption.countDocuments({ voucherId: voucher._id });
    if (totalUses >= voucher.usageLimitTotal) {
      throw new ApiError(400, 'Voucher maximum usage limit reached');
    }
  }

  // Per user usage limit
  if (voucher.usageLimitPerUser) {
    const userUses = await VoucherRedemption.countDocuments({ voucherId: voucher._id, userId });
    if (userUses >= voucher.usageLimitPerUser) {
      throw new ApiError(400, 'You have already used this voucher');
    }
  }

  return voucher;
};

export const redeemVoucher = async (voucherId: string, userId: string, orderId: string) => {
  return VoucherRedemption.create({
    voucherId,
    userId,
    orderId,
  });
};

export const applyVoucherToOrder = async (orderId: string, userId: string, voucherCode: string) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.voucherId) {
    throw new ApiError(400, 'A voucher has already been applied to this order');
  }

  // Calculate order amount for validation (subtotal + extraFee)
  const currentAmount = order.subtotal + order.extraFee;

  // Validate voucher
  const voucher = await validateVoucher(voucherCode, userId, currentAmount);

  // Calculate discount
  let discountTotal = 0;
  if (voucher.discountType === 'PERCENTAGE') {
    discountTotal = (currentAmount * voucher.discountValue) / 100;
    if (voucher.maxDiscount && discountTotal > voucher.maxDiscount) {
      discountTotal = voucher.maxDiscount;
    }
  } else {
    discountTotal = voucher.discountValue;
  }

  // Ensure discount doesn't exceed order amount
  if (discountTotal > currentAmount) {
    discountTotal = currentAmount;
  }

  // Update order
  order.discountTotal = discountTotal;
  order.totalAmount = currentAmount + order.deliveryFee - discountTotal;
  order.voucherId = voucher._id;

  await order.save();

  return order;
};
