import User from '../../database/models/User.js';
import { hashPassword } from '../../utils/password.js';

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateProfile = async (userId: string, updateData: Partial<{ name: string; telephone: string; address: string }>) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

export const getUsers = async (filters: { role?: string; isActive?: boolean; search?: string }) => {
  const query: any = {};
  
  if (filters.role) {
    query.role = filters.role;
  }
  
  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }
  
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } },
      { telephone: { $regex: filters.search, $options: 'i' } },
    ];
  }
  
  return await User.find(query).select('-password -refreshToken').sort({ createdAt: -1 });
};

export const createUser = async (userData: any) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  const hashedPassword = await hashPassword(userData.password);
  
  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });
  
  const result = user.toObject();
  delete (result as any).password;
  delete (result as any).refreshToken;
  return result;
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).select('-password -refreshToken');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateAnyUser = async (id: string, updateData: any) => {
  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }
  
  const user = await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

export const softDeleteUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true }
  ).select('-password -refreshToken');

  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};
