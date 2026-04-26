import * as analyticsService from '../../modules/analytics/service.js';
import Revenue from '../../database/models/Revenue.js';
import Expense from '../../database/models/Expense.js';
import User from '../../database/models/User.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

describe('Analytics Service', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('addRevenue & addExpense', () => {
    it('should create revenue record', async () => {
      const rev = await analyticsService.addRevenue({ name: 'Test Rev', amount: 100, date: new Date() });
      expect(rev.amount).toBe(100);
    });

    it('should create expense record', async () => {
      const exp = await analyticsService.addExpense({ name: 'Test Exp', amount: 50, date: new Date() });
      expect(exp.amount).toBe(50);
    });
  });

  describe('getMonthlyAnalysis', () => {
    it('should calculate net profit correctly', async () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const today = new Date();

      await Revenue.create({ name: 'R1', amount: 1000, date: today, sourceType: 'MANUAL' });
      await Expense.create({ name: 'E1', amount: 300, date: today });

      const analysis = await analyticsService.getMonthlyAnalysis(year, month);
      expect(analysis.totalRevenue).toBe(1000);
      expect(analysis.totalExpenses).toBe(300);
      expect(analysis.netProfit).toBe(700);
    });
  });

  describe('getDashboardKPIs', () => {
    it('should return basic KPI structure', async () => {
      // Create some data to satisfy countDocuments
      await User.create({ name: 'Staff', email: 's@e.com', password: 'password123', telephone: '1', role: 'STAFF', isActive: true });
      await User.create({ name: 'Customer', email: 'c@e.com', password: 'password123', telephone: '2', role: 'CUSTOMER' });

      const kpis = await analyticsService.getDashboardKPIs('today');
      expect(kpis).toHaveProperty('todayRevenue');
      expect(kpis.activeStaff).toBe(1);
      expect(kpis.totalCustomers).toBe(1);
    });
  });
});
