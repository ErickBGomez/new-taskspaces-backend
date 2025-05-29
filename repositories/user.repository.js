import { parseUserData } from '../helpers/user.helper.js';
import prisma from '../utils/prisma.js';
import { ROLE_STRING_TO_INT } from '../utils/user.utils.js';

export const selectUser = {
  id: true,
  fullname: true,
  username: true,
  avatar: true,
  email: true,
  created_at: true,
  updated_at: true,
};

export const findAllUsers = async () => {
  const users = await prisma.user_app.findMany({
    select: { ...selectUser },
  });

  return users.map((user) => parseUserData(user));
};

export const findUserById = async (id) => {
  const user = await prisma.user_app.findUnique({
    where: {
      id: parseInt(id),
    },
    select: { ...selectUser },
  });

  return parseUserData(user);
};

export const findUserByEmail = async (email, exposeSensitive = false) => {
  let user;

  if (exposeSensitive) {
    user = await prisma.user_app.findFirst({
      where: { email },
      select: {
        ...selectUser,
        password: true,
        role: { select: { value: true } },
      },
    });
  } else {
    user = await prisma.user_app.findFirst({
      where: { email },
      select: {
        ...selectUser,
      },
    });
  }

  return parseUserData(user);
};

export const findUserByUsername = async (username) => {
  const user = await prisma.user_app.findFirst({
    where: { username },
    select: { ...selectUser },
  });

  return parseUserData(user);
};

export const createUser = async (user) => {
  const { role, ...userData } = user;

  const createdUser = await prisma.user_app.create({
    data: {
      ...userData,
      role_id: ROLE_STRING_TO_INT[role] || 1, // Default to USER if role is not recognized,
    },
    select: { ...selectUser },
  });

  return parseUserData(createdUser);
};

export const updateUser = async (id, user) => {
  // Remove role is it was provided in the request
  // eslint-disable-next-line no-unused-vars
  const { role, ...userData } = user;

  const updatedUser = await prisma.user_app.update({
    where: {
      id: parseInt(id),
    },
    data: { ...userData },
    select: { ...selectUser },
  });

  return parseUserData(updatedUser);
};

export const deleteUser = async (id) => {
  const deletedUser = await prisma.user_app.delete({
    where: {
      id: parseInt(id),
    },
    select: { ...selectUser },
  });

  return parseUserData(deletedUser);
};

// Helper function to find user with password for authentication
export const findUserWithPasswordById = async (id) => {
  const user = await prisma.user_app.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      ...selectUser,
      role: { select: { value: true } },
    },
  });

  return parseUserData(user);
};
