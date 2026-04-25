import * as loyaltyService from '../../modules/loyalty/loyalty.service.js';
import CustomerLoyalty from '../../database/models/CustomerLoyalty.js';
import LoyaltyTier from '../../database/models/LoyaltyTier.js';
import User from '../../database/models/User.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

describe('Loyalty Service', () => {
  let userId: string;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    const user = await User.create({
      name: 'Customer',
      email: 'c@example.com',
      password: 'password123',
      telephone: '0771234567'
    });
    userId = user._id.toString();

    // Create default tiers
    await LoyaltyTier.create([
      { name: 'BRONZE', minPoints: 0, discountValue: 0 },
      { name: 'SILVER', minPoints: 500, discountValue: 5 },
      { name: 'GOLD', minPoints: 1000, discountValue: 10 }
    ]);
  });

  describe('awardLoyaltyPoints', () => {
    it('should award points and create loyalty record if first time', async () => {
      const orderId = '507f1f77bcf86cd799439011';
      await loyaltyService.awardLoyaltyPoints(userId, 100, orderId);

      const loyalty = await CustomerLoyalty.findOne({ userId });
      expect(loyalty?.points).toBe(100);

      const user = await User.findById(userId);
      expect(user?.loyaltyPoints).toBe(100);
    });

    it('should upgrade tier when points threshold is reached', async () => {
      const orderId = '507f1f77bcf86cd799439011';
      await loyaltyService.awardLoyaltyPoints(userId, 600, orderId);

      const loyalty = await CustomerLoyalty.findOne({ userId }).populate('tierId');
      expect((loyalty?.tierId as any).name).toBe('SILVER');

      const user = await User.findById(userId);
      expect(user?.membership?.level).toBe('SILVER');
    });

    it('should not award points for same order twice', async () => {
      const orderId = '507f1f77bcf86cd799439011';
      await loyaltyService.awardLoyaltyPoints(userId, 100, orderId);
      await loyaltyService.awardLoyaltyPoints(userId, 100, orderId);

      const user = await User.findById(userId);
      expect(user?.loyaltyPoints).toBe(100);
    });
  });
});
