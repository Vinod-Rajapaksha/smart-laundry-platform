import * as serviceModule from '../../modules/service/service.js';
import ServiceCategory from '../../database/models/ServiceCategory.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

describe('Service Module Service', () => {
  let categoryId: string;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    const category = await ServiceCategory.create({ name: 'Wash' });
    categoryId = category._id.toString();
  });

  describe('createService', () => {
    it('should create a new service', async () => {
      const input = { categoryId, name: 'Normal Wash', price: 50 };
      const service = await serviceModule.createService(input);
      expect(service.name).toBe(input.name);
      expect(service.price).toBe(input.price);
    });
  });

  describe('getAllServices', () => {
    it('should list services with pagination', async () => {
      await serviceModule.createService({ categoryId, name: 'S1', price: 10 });
      await serviceModule.createService({ categoryId, name: 'S2', price: 20 });

      const result = await serviceModule.getAllServices({ limit: 1 });
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter by category name', async () => {
      await serviceModule.createService({ categoryId, name: 'Wash 1', price: 10 });
      const otherCat = await ServiceCategory.create({ name: 'Iron' });
      await serviceModule.createService({ categoryId: otherCat._id.toString(), name: 'Iron 1', price: 20 });

      const result = await serviceModule.getAllServices({ category: 'Wash' });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Wash 1');
    });
  });

  describe('updateService', () => {
    it('should update service details', async () => {
      const service = await serviceModule.createService({ categoryId, name: 'Old', price: 10 });
      const updated = await serviceModule.updateService(service._id.toString(), { name: 'New' });
      expect(updated.name).toBe('New');
    });
  });
});
