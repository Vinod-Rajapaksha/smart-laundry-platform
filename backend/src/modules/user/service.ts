import User from '../../database/models/User.js';

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
