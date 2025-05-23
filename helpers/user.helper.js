import bcrypt from 'bcrypt';
import {
  findUserByEmail,
  findUserByUsername,
} from '../repositories/user.repository.js';

export const checkUserExists = async (username, email) => {
  const userByUsername = await findUserByUsername(username);

  if (userByUsername) {
    return { exists: true, field: 'username' };
  }

  const userByEmail = await findUserByEmail(email);

  if (userByEmail) {
    return { exists: true, field: 'email' };
  }

  return { exists: false };
};

// Helper function to hash password
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Helper function to compare password
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Transform user data to maintain API compatibility
export const parseUserData = (user) => {
  if (!user) return null;

  const { role, ...userData } = user;

  return {
    ...userData,
    role: role?.value || 'USER',
  };
};
