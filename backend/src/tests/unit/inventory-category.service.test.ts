import * as categoryService from '../../modules/inventory-category/service.js';
import InventoryCategory from '../../database/models/InventoryCategory.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

describe('Inventory Category Service', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('createCategory', () => {
    it('should create a new inventory category', async () => {
      const input = { name: 'Detergents' };
      const category = await categoryService.createCategory(input);
      expect(category.name).toBe(input.name);
    });
  });

  describe('updateCategory', () => {
    it('should update an existing inventory category', async () => {
      const category = await categoryService.createCategory({ name: 'Chemicals' });
      const updated = await categoryService.updateCategory(category._id.toString(), { name: 'Industrial Chemicals' });
      expect(updated.name).toBe('Industrial Chemicals');
    });
  });

  describe('deleteCategory', () => {
    it('should delete an inventory category', async () => {
      const category = await categoryService.createCategory({ name: 'Old Cat' });
      await categoryService.deleteCategory(category._id.toString());
      const found = await InventoryCategory.findById(category._id);
      expect(found).toBeNull();
    });
  });
});
