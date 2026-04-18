import CustomerLoyalty from '../../database/models/CustomerLoyalty.js';
import LoyaltyTier from '../../database/models/LoyaltyTier.js';
import LoyaltyTransaction from '../../database/models/LoyaltyTransaction.js';
import ApiError from '../../core/apiError.js';

export const awardLoyaltyPoints = async (userId: string, pointsAmount: number, orderId: string) => {
  // 1. Get or create customer loyalty record
  let loyalty = await CustomerLoyalty.findOne({ userId });
  
  if (!loyalty) {
    // Get default tier (the one with 0 points required)
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

  // 4. Record transaction
  await LoyaltyTransaction.create({
    loyaltyId: loyalty._id,
    points: pointsAmount,
    type: 'EARNED'
  });

  return loyalty;
};

export const getLoyaltyStatus = async (userId: string) => {
  const loyalty = await CustomerLoyalty.findOne({ userId })
    .populate('tierId')
    .exec();
  return loyalty;
};
