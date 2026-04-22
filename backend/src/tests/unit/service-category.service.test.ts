import * as categoryService from '../../modules/service-category/service.js';
import ServiceCategory from '../../database/models/ServiceCategory.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

describe('Service Category Service', () => {
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
    it('should create a new category', async () => {
      const input = { name: 'Laundry', price: 100 };
      const category = await categoryService.createCategory(input);
      expect(category.name).toBe(input.name);
      expect(category.price).toBe(input.price);
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      const category = await categoryService.createCategory({ name: 'Dry Clean' });
      const updated = await categoryService.updateCategory(category._id.toString(), { name: 'Premium Dry Clean' });
      expect(updated.name).toBe('Premium Dry Clean');
    });

    it('should throw 404 if category not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await expect(categoryService.updateCategory(fakeId, { name: 'Fail' }))
        .rejects.toThrow('Category not found');
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const category = await categoryService.createCategory({ name: 'To Delete' });
      await categoryService.deleteCategory(category._id.toString());
      const found = await ServiceCategory.findById(category._id);
      expect(found).toBeNull();
    });
  });

  describe('getAllCategories', () => {
    it('should list all categories', async () => {
      await categoryService.createCategory({ name: 'B' });
      await categoryService.createCategory({ name: 'A' });

      const all = await categoryService.getAllCategories();
      expect(all).toHaveLength(2);
      expect(all[0].name).toBe('A'); // Sorted by name
    });
  });
});
