import User from "../../database/models/User.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { Role } from "../../core/constants.js";

interface CreateUserInput {
  name: string;
  email: string;
  telephone: string;
  address?: string;
  password: string;
  role?: Role;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  telephone?: string;
  address?: string;
  password?: string;
  isActive?: boolean;
}

interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
}

type AppError = Error & { statusCode?: number };

const createError = (message: string, statusCode: number): AppError => {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  return err;
};

/**
 * Create a new user
 */
export const createUser = async (input: CreateUserInput) => {
  const { name, email, telephone, address, password, role } = input;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createError("Email is already in use", 409);

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create new user
  const newUser = new User({
    name,
    email,
    telephone,
    address: address || "",
    password: hashedPassword,
    role: role || "CUSTOMER",
    isActive: true,
  });

  const savedUser = await newUser.save();

  // Return user without password
  const userObj = savedUser.toObject() as any;
  delete userObj.password;
  return userObj;
};

/**
 * Get all users with pagination and filtering
 */
export const getAllUsers = async (query: PaginationQuery) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, query.limit || 10);
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { telephone: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.role) {
    filter.role = query.role;
  }

  const [data, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) throw createError("User not found", 404);

  return user;
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email }).select("-password -refreshToken");

  if (!user) throw createError("User not found", 404);

  return user;
};

/**
 * Update user
 */
export const updateUser = async (userId: string, input: UpdateUserInput) => {
  const user = await User.findById(userId);

  if (!user) throw createError("User not found", 404);

  // Check if email is being updated and already exists
  if (input.email && input.email !== user.email) {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) throw createError("Email is already in use", 409);
  }

  // Update fields
  if (input.name) user.name = input.name;
  if (input.email) user.email = input.email;
  if (input.telephone) user.telephone = input.telephone;
  if (input.address !== undefined) user.address = input.address;
  if (input.password) {
    const hashedPassword = await hashPassword(input.password);
    user.password = hashedPassword;
  }
  if (input.isActive !== undefined) user.isActive = input.isActive;

  const updatedUser = await user.save();

  // Return user without password
  const userObj = updatedUser.toObject() as any;
  delete userObj.password;
  return userObj;
};

/**
 * Delete user (soft delete by marking as inactive)
 */
export const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw createError("User not found", 404);

  user.isActive = false;
  await user.save();

  return { message: "User deleted successfully" };
};

/**
 * Permanently delete user
 */
export const permanentlyDeleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) throw createError("User not found", 404);

  return { message: "User permanently deleted successfully" };
};

/**
 * Change user status (active/inactive)
 */
export const toggleUserStatus = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw createError("User not found", 404);

  user.isActive = !user.isActive;
  const updatedUser = await user.save();

  const userObj = updatedUser.toObject() as any;
  delete userObj.password;
  return userObj;
};

/**
 * Get users count by role
 */
export const getUserCountByRole = async () => {
  const counts = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    ADMIN: 0,
    STAFF: 0,
    CUSTOMER: 0,
  };

  counts.forEach((item) => {
    if (item._id in result) {
      result[item._id as Role] = item.count;
    }
  });

  return result;
};
