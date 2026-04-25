import * as voucherService from '../../modules/voucher/service.js';
import Voucher from '../../database/models/Voucher.js';
import User from '../../database/models/User.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

describe('Voucher Service', () => {
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
      telephone: '0771234567',
      membership: { level: 'BRONZE' }
    });
    userId = user._id.toString();
  });

  describe('validateVoucher', () => {
    it('should validate a valid voucher successfully', async () => {
      const now = new Date();
      const start = new Date(now.getTime() - 86400000);
      const end = new Date(now.getTime() + 86400000);

      const voucher = await Voucher.create({
        code: 'SAVE10',
        voucherType: 'PROMO',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderAmount: 100,
        startDate: start,
        endDate: end,
        isActive: true
      });

      const validated = await voucherService.validateVoucher('SAVE10', userId, 200);
      expect(validated.code).toBe('SAVE10');
    });

    it('should throw error if order amount is below minimum', async () => {
      await Voucher.create({
        code: 'MIN500',
        voucherType: 'PROMO',
        discountType: 'FIXED',
        discountValue: 50,
        minOrderAmount: 500,
        startDate: new Date('2020-01-01'),
        endDate: new Date('2030-01-01'),
        isActive: true
      });

      await expect(voucherService.validateVoucher('MIN500', userId, 400))
        .rejects.toThrow('Minimum order amount for this voucher is LKR 500');
    });

    it('should block non-bronze members from using vouchers', async () => {
      const goldUser = await User.create({
        name: 'Gold User',
        email: 'gold@example.com',
        password: 'password123',
        telephone: '0770000000',
        membership: { level: 'GOLD' }
      });

      await Voucher.create({
        code: 'ANYBODY',
        voucherType: 'PROMO',
        discountType: 'FIXED',
        discountValue: 10,
        minOrderAmount: 0,
        startDate: new Date('2020-01-01'),
        endDate: new Date('2030-01-01'),
        isActive: true
      });

      await expect(voucherService.validateVoucher('ANYBODY', goldUser._id.toString(), 100))
        .rejects.toThrow('Vouchers are only available for Bronze members');
    });
  });
});
