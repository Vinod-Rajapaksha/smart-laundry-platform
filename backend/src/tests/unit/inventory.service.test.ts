import { jest } from '@jest/globals';
import * as inventoryService from '../../modules/inventory/service.js';
import Inventory from '../../database/models/Inventory.js';
import Supplier from '../../database/models/Supplier.js';
import StockMovement from '../../database/models/StockMovement.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';
import * as mailService from '../../utils/mailService.js';

describe('Inventory Service', () => {
  let supplierId: string;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    jest.spyOn(mailService, 'sendEmail').mockResolvedValue(undefined as any);
    const supplier = await Supplier.create({
      name: 'Vendor 1',
      email: 'v1@example.com',
      contactPerson: 'John Doe',
      phone: '0112345678',
      address: 'No 1, Colombo',
      category: 'Detergents'
    });
    supplierId = supplier._id.toString();
  });

  describe('createInventory', () => {
    it('should create inventory item with generated ID', async () => {
      const input: any = {
        name: 'Detergent X',
        categoryName: 'Detergents',
        unit: 'KG',
        unitPrice: 10,
        supplierId
      };

      const item = await inventoryService.createInventory(input);
      expect(item.itemId).toBeDefined();
      expect(item.name).toBe(input.name);
    });

    it('should handle isDefault flag by unsetting other defaults in category', async () => {
      await Inventory.create({ name: 'D1', categoryName: 'Cat1', unit: 'KG', unitPrice: 1, isDefault: true, supplierId });

      const input: any = {
        name: 'D2',
        categoryName: 'Cat1',
        unit: 'KG',
        unitPrice: 1,
        isDefault: true,
        supplierId
      };

      await inventoryService.createInventory(input);
      const items = await Inventory.find({ categoryName: 'Cat1' });
      expect(items.find(i => i.name === 'D1')?.isDefault).toBe(false);
      expect(items.find(i => i.name === 'D2')?.isDefault).toBe(true);
    });
  });

  describe('markAsOrdered', () => {
    it('should send email and mark item as order pending', async () => {
      const item = await Inventory.create({ name: 'Soap', categoryName: 'C1', unit: 'PCS', unitPrice: 1, supplierId });

      await inventoryService.markAsOrdered(item._id.toString(), 100);

      expect(mailService.sendEmail).toHaveBeenCalled();
      const updated = await Inventory.findById(item._id);
      expect(updated?.isOrderPending).toBe(true);
    });
  });

  describe('confirmRestock', () => {
    it('should update stock and create movement record', async () => {
      const item = await Inventory.create({
        name: 'Soap',
        categoryName: 'C1',
        unit: 'PCS',
        unitPrice: 1,
        qtyInStock: 10,
        batchQty: 50,
        supplierId
      });

      await inventoryService.confirmRestock(item._id.toString());

      const updated = await Inventory.findById(item._id);
      expect(updated?.qtyInStock).toBe(60);
      expect(updated?.isOrderPending).toBe(false);

      const movement = await StockMovement.findOne({ itemId: item._id });
      expect(movement?.type).toBe('IN');
      expect(movement?.quantity).toBe(50);
    });
  });
});
