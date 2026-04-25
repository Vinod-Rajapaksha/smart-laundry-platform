import * as settingsService from '../../modules/settings/service.js';
import SystemSetting from '../../database/models/SystemSetting.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

describe('Settings Service', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('getSetting', () => {
    it('should return stored value if setting exists', async () => {
      await SystemSetting.create({ key: 'test_key', value: 'test_value' });
      const val = await settingsService.getSetting('test_key');
      expect(val).toBe('test_value');
    });

    it('should return default value if setting missing', async () => {
      const val = await settingsService.getSetting('missing', 'fallback');
      expect(val).toBe('fallback');
    });
  });

  describe('updateSetting', () => {
    it('should update existing setting or create new one', async () => {
      await settingsService.updateSetting('new_key', true);
      const val = await settingsService.getSetting('new_key');
      expect(val).toBe(true);

      await settingsService.updateSetting('new_key', false);
      const val2 = await settingsService.getSetting('new_key');
      expect(val2).toBe(false);
    });
  });
});
