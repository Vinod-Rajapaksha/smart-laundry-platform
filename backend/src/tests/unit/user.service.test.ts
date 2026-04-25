import * as userService from '../../modules/user/service.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../testHelpers.js';

describe('User Service', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CUSTOMER',
        telephone: '0771234567'
      };

      const user = await userService.createUser(userData);
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user).not.toHaveProperty('password');
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CUSTOMER',
        telephone: '0771234567'
      };

      await userService.createUser(userData);
      await expect(userService.createUser(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userData = {
        name: 'Profile User',
        email: 'profile@example.com',
        password: 'password123',
        role: 'CUSTOMER',
        telephone: '0771234567'
      };

      const createdUser = await userService.createUser(userData);
      const profile = await userService.getProfile(createdUser._id.toString());

      expect(profile.name).toBe(userData.name);
      expect(profile.email).toBe(userData.email);
    });

    it('should throw error if user not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await expect(userService.getProfile(fakeId)).rejects.toThrow('User not found');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const userData = {
        name: 'Old Name',
        email: 'old@example.com',
        password: 'password123',
        role: 'CUSTOMER',
        telephone: '0771234567'
      };

      const createdUser = await userService.createUser(userData);
      const updatedUser = await userService.updateProfile(createdUser._id.toString(), { name: 'New Name' });

      expect(updatedUser.name).toBe('New Name');
    });

    it('should throw error if updated email is already in use', async () => {
      await userService.createUser({ name: 'User 1', email: 'user1@example.com', password: 'password123', role: 'CUSTOMER', telephone: '0771234567' });
      const user2 = await userService.createUser({ name: 'User 2', email: 'user2@example.com', password: 'password123', role: 'CUSTOMER', telephone: '0777654321' });

      await expect(userService.updateProfile(user2._id.toString(), { email: 'user1@example.com' }))
        .rejects.toThrow('Email already in use by another account');
    });
  });

  describe('softDeleteUser', () => {
    it('should deactivate user successfully', async () => {
      const user = await userService.createUser({ name: 'Delete Me', email: 'delete@example.com', password: 'password123', role: 'CUSTOMER', telephone: '0770000000' });
      const deletedUser = await userService.softDeleteUser(user._id.toString());

      expect(deletedUser.isActive).toBe(false);
    });
  });
});
