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
import { checkUserExists } from '../helpers/user.helper.js';
import { sendPasswordResetEmail } from './mail.service.js';

export const findAllUsers = async () => {
  return await userRepository.findAllUsers();
};

export const findUserById = async (id) => {
  const user = await userRepository.findUserById(id);

  if (!user) {
    throw new UserNotFoundError();
  }

  return user;
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

  if (userCheck.exists) {
    throw new UserAlreadyExistsError([
      {
        field: userCheck.field,
        errors: [`A user with this ${userCheck.field} already exists`],
      },
    ]);
  }

  if (password !== confirmPassword) {
    throw new PasswordDoNotMatchError();
  }

  return await userRepository.createUser({
    fullname,
    username,
    avatar,
    email,
    password,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new IncorrectCredentialsError();
  }

  const { _id, fullname, username, avatar } = user;

  const comparedPassword = await user.comparePassword(password);

  if (!comparedPassword) {
    throw new IncorrectCredentialsError();
  }

  // Saved user information goes here
  const token = jwt.sign(
    { id: user._id, username: user.username },
    config.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return { user: { _id, fullname, username, avatar, email }, token };
};

export const updateUser = async (
  id,
  { fullname, username, avatar, email, description }
) => {
  const userExists = await userRepository.findUserById(id);

  if (!userExists) {
    throw new UserNotFoundError();
  }

  return await userRepository.updateUser(id, {
    fullname,
    username,
    avatar,
    email,
    description,
  });
};

export const requestUpdatePassword = async (email) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new UserNotFoundError();
  }

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: '1h',
  });

  await sendPasswordResetEmail(user.email, token);
};

export const updatePassword = async (id, newPassword, confirmPassword) => {
  const userExists = await userRepository.findUserById(id);
  const comparedPassword = await userExists.comparePassword(newPassword);

  if (!userExists) {
    throw new UserNotFoundError();
  }

  if (newPassword !== confirmPassword) {
    throw new PasswordDoNotMatchError();
  }

  if (comparedPassword) {
    throw new SameOldPasswordError();
  }

  return await userRepository.updateUser(id, { password: newPassword });
};

export const deleteUser = async (id) => {
  const userExists = await userRepository.findUserById(id);

  if (!userExists) {
    throw new UserNotFoundError();
  }

  return await userRepository.deleteUser(id);
};
