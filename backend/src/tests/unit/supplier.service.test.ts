import * as supplierService from '../../modules/supplier/service.js';
import Supplier from '../../database/models/Supplier.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

describe('Supplier Service', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('createSupplier', () => {
    it('should create supplier successfully', async () => {
      const data = {
        name: 'Sup 1',
        email: 'sup1@example.com',
        contactPerson: 'Person 1',
        phone: '0111111111',
        address: 'Addr 1',
        category: 'Cat 1'
      };
      const supplier = await supplierService.createSupplier(data);
      expect(supplier.name).toBe('Sup 1');
    });

    it('should throw error for duplicate email', async () => {
      const data = {
        name: 'Sup 1',
        email: 'sup1@example.com',
        contactPerson: 'Person 1',
        phone: '0111111111',
        address: 'Addr 1',
        category: 'Cat 1'
      };
      await supplierService.createSupplier(data);
      await expect(supplierService.createSupplier(data)).rejects.toThrow('Supplier with this email already exists');
    });
  });

  describe('getSupplierStats', () => {
    it('should return correct stats', async () => {
      await Supplier.create({ name: 'S1', email: 's1@e.com', contactPerson: 'P1', phone: '1', address: 'A1', category: 'C1', status: 'ACTIVE' });
      await Supplier.create({ name: 'S2', email: 's2@e.com', contactPerson: 'P2', phone: '2', address: 'A2', category: 'C2', status: 'INACTIVE' });

      const stats = await supplierService.getSupplierStats();
      expect(stats.totalSuppliers).toBe(2);
      expect(stats.activeSuppliers).toBe(1);
      expect(stats.totalCategories).toBe(2);
    });
  });
});
