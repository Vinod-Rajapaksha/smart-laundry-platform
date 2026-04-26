import User from '../../database/models/User.js';
import { hashPassword, comparePassword } from '../../utils/password.js';

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateProfile = async (userId: string, updateData: Partial<{ name: string; telephone: string; address: string; avatar: string; email: string }>) => {
  if (updateData.email) {
    const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
    if (existingUser) {
      throw new Error('Email already in use by another account');
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { returnDocument: 'after', runValidators: true }
  ).select('-password -refreshToken');

  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

export const changePassword = async (userId: string, { currentPassword, newPassword }: any) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) throw new Error('Current password does not match');

  user.password = await hashPassword(newPassword);
  await user.save();
  return true;
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
    { returnDocument: 'after', runValidators: true }
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
    { returnDocument: 'after' }
  ).select('-password -refreshToken');

  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};
