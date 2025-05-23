// services/user.service.js
import * as userRepository from '../repositories/user.repository.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // You'll need to handle password hashing manually now
import config from '../config/config.js';
import {
  UserNotFoundError,
  UserAlreadyExistsError,
  IncorrectCredentialsError,
  PasswordDoNotMatchError,
  SameOldPasswordError,
} from '../errors/user.errors.js';
import { checkUserExists } from '../helpers/user.helper.js';
import { sendPasswordResetEmail } from './mail.service.js';

// Helper function to hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Helper function to compare password
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Transform user data to maintain API compatibility
const transformUserData = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    description: user.description,
    role: user.role?.value || 'USER', // Convert back to string
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const findAllUsers = async () => {
  const users = await userRepository.findAllUsers();
  return users.map(transformUserData);
};

export const findUserById = async (id) => {
  const user = await userRepository.findUserById(id);

  if (!user) throw new UserNotFoundError();

  return transformUserData(user);
};

export const registerUser = async ({
  fullname,
  username,
  avatar,
  email,
  password,
  confirmPassword,
}) => {
  const userCheck = await checkUserExists(username, email);

  if (userCheck.exists)
    throw new UserAlreadyExistsError([
      {
        field: userCheck.field,
        errors: [`A user with this ${userCheck.field} already exists`],
      },
    ]);

  if (password !== confirmPassword) throw new PasswordDoNotMatchError();

  // Hash password before storing
  const hashedPassword = await hashPassword(password);

  const createdUser = await userRepository.createUser({
    fullname,
    username,
    avatar,
    email,
    password: hashedPassword,
    role: 'USER',
  });

  return transformUserData(createdUser);
};

export const loginUser = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email, true);

  if (!user) throw new IncorrectCredentialsError();

  // Compare password manually since we don't have Mongoose methods
  const comparedPassword = await comparePassword(password, user.password);

  if (!comparedPassword) throw new IncorrectCredentialsError();

  const { id, fullname, username, avatar, role } = user;

  // Create JWT token
  const token = jwt.sign(
    {
      id: user.id,
      username,
      role: role.value,
    },
    config.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return {
    user: {
      id,
      fullname,
      username,
      avatar,
      email: user.email,
    },
    token,
  };
};

export const updateUser = async (
  id,
  { fullname, username, avatar, email, description }
) => {
  const userExists = await userRepository.findUserById(id);

  if (!userExists) throw new UserNotFoundError();

  const updatedUser = await userRepository.updateUser(id, {
    fullname,
    username,
    avatar,
    email,
    description,
  });

  return transformUserData(updatedUser);
};

export const requestUpdatePassword = async (email) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) throw new UserNotFoundError();

  const token = jwt.sign({ id: user.id }, config.JWT_SECRET, {
    expiresIn: '1h',
  });

  await sendPasswordResetEmail(user.email, token);
};

export const updatePassword = async (id, newPassword, confirmPassword) => {
  // Get user with password for comparison
  const userExists = await userRepository.findUserWithPasswordById(id);

  if (!userExists) throw new UserNotFoundError();

  if (newPassword !== confirmPassword) throw new PasswordDoNotMatchError();

  // Check if new password is same as old password
  const comparedPassword = await comparePassword(
    newPassword,
    userExists.password
  );
  if (comparedPassword) throw new SameOldPasswordError();

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  const updatedUser = await userRepository.updateUser(id, {
    password: hashedPassword,
  });

  return transformUserData(updatedUser);
};

export const deleteUser = async (id) => {
  const userExists = await userRepository.findUserById(id);

  if (!userExists) throw new UserNotFoundError();

  const deletedUser = await userRepository.deleteUser(id);
  return transformUserData(deletedUser);
};
