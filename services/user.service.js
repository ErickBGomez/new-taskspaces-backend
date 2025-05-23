// services/user.service.js
import * as userRepository from '../repositories/user.repository.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import {
  UserNotFoundError,
  UserAlreadyExistsError,
  IncorrectCredentialsError,
  PasswordDoNotMatchError,
  SameOldPasswordError,
} from '../errors/user.errors.js';
import {
  checkUserExists,
  comparePassword,
  hashPassword,
  parseUserData,
} from '../helpers/user.helper.js';
import { sendPasswordResetEmail } from './mail.service.js';

export const findAllUsers = async () => {
  const users = await userRepository.findAllUsers();
  return users.map(parseUserData);
};

export const findUserById = async (id) => {
  const user = await userRepository.findUserById(id);

  if (!user) throw new UserNotFoundError();

  return parseUserData(user);
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

  return parseUserData(createdUser);
};

export const loginUser = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email, true);

  if (!user) throw new IncorrectCredentialsError();

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

  return parseUserData(updatedUser);
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

  return parseUserData(updatedUser);
};

export const deleteUser = async (id) => {
  const userExists = await userRepository.findUserById(id);

  if (!userExists) throw new UserNotFoundError();

  const deletedUser = await userRepository.deleteUser(id);
  return parseUserData(deletedUser);
};
