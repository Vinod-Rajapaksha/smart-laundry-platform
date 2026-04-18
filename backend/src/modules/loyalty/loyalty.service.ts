import CustomerLoyalty from '../../database/models/CustomerLoyalty.js';
import LoyaltyTier from '../../database/models/LoyaltyTier.js';
import LoyaltyTransaction from '../../database/models/LoyaltyTransaction.js';
import User from '../../database/models/User.js';
import ApiError from '../../core/apiError.js';
import { LOYALTY_RULES, LOYALTY_TIER_NAME } from '../../core/constants.js';

export const awardLoyaltyPoints = async (userId: string, pointsAmount: number, orderId: string) => {
  // 1. Get or create customer loyalty record
  let loyalty = await CustomerLoyalty.findOne({ userId });

  if (!loyalty) {
    const defaultTier = await LoyaltyTier.findOne({ minPoints: 0 }) || await LoyaltyTier.findOne().sort({ minPoints: 1 });
    if (!defaultTier) throw new ApiError(500, 'No loyalty tiers configured');

    loyalty = await CustomerLoyalty.create({
      userId,
      tierId: defaultTier._id,
      points: 0,
      totalSpent: 0
    });
  }

  // 2. Update points
  loyalty.points += pointsAmount;

  // 3. Check for tier upgrade
  const nextTier = await LoyaltyTier.findOne({
    minPoints: { $lte: loyalty.points },
    isActive: true
  }).sort({ minPoints: -1 });

  if (nextTier && String(nextTier._id) !== String(loyalty.tierId)) {
    loyalty.tierId = nextTier._id;
  }

  await loyalty.save();

  // 4. Update User Model for consistency
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + (LOYALTY_RULES.MEMBERSHIP_DURATION_DAYS || 90));

  await User.findByIdAndUpdate(userId, {
    $inc: { loyaltyPoints: pointsAmount },
    $set: {
      'membership.level': nextTier?.name || LOYALTY_TIER_NAME.BRONZE,
      'membership.validUntil': expiryDate
    }
  });

  // 5. Record transaction
  await LoyaltyTransaction.create({
    loyaltyId: loyalty._id,
    points: pointsAmount,
    type: 'EARNED',
    description: `Points earned from order #${orderId.substring(0, 8)}`
  });

  return loyalty;
};

export const getLoyaltyStatus = async (userId: string) => {
  const loyalty = await CustomerLoyalty.findOne({ userId })
    .populate('tierId')
    .exec();

  const user = await User.findById(userId);

  // Check for expiry
  if (user?.membership?.validUntil && new Date() > user.membership.validUntil) {
    // Reset to basic tier if expired
    const bronzeTier = await LoyaltyTier.findOne({ name: LOYALTY_TIER_NAME.BRONZE });
    
    if (loyalty) {
      loyalty.tierId = bronzeTier?._id || loyalty.tierId;
      await loyalty.save();
    }

    await User.findByIdAndUpdate(userId, {
       'membership.level': LOYALTY_TIER_NAME.BRONZE,
       'membership.validUntil': null
    });
  }

  return loyalty;
};

export const getLoyaltyHistory = async (userId: string) => {
  const loyalty = await CustomerLoyalty.findOne({ userId });
  if (!loyalty) return [];

  const transactions = await LoyaltyTransaction.find({ loyaltyId: loyalty._id })
    .sort({ createdAt: -1 })
    .exec();
  return transactions;
};

export const getAllTiers = async () => {
  return await LoyaltyTier.find({ isActive: true }).sort({ minPoints: 1 });
};
