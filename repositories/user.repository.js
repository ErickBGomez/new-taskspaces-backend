import { parseUserData } from '../helpers/user.helper.js';
import prisma from '../utils/prisma.js';
import { ROLE_STRING_TO_INT } from '../utils/user.utils.js';

export const findAllUsers = async () => {
  const users = await prisma.user_app.findMany({
    select: {
      id: true,
      fullname: true,
      username: true,
      avatar: true,
      email: true,
      created_at: true,
      updated_at: true,
    },
  });

  return users.map((user) => parseUserData(user));
};

export const findUserById = async (id) => {
  const user = await prisma.user_app.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      fullname: true,
      username: true,
      avatar: true,
      email: true,
      created_at: true,
      updated_at: true,
    },
  });

  return parseUserData(user);
};

export const findUserByEmail = async (email, exposeSensitive = false) => {
  let user;

  if (exposeSensitive) {
    user = await prisma.user_app.findFirst({
      where: { email },
      select: {
        id: true,
        fullname: true,
        username: true,
        avatar: true,
        email: true,
        password: true,
        created_at: true,
        updated_at: true,
        role: { select: { value: true } },
      },
    });
  } else {
    user = await prisma.user_app.findFirst({
      where: { email },
      select: {
        id: true,
        fullname: true,
        username: true,
        avatar: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  return parseUserData(user);
};

export const findUserByUsername = async (username) => {
  const user = await prisma.user_app.findFirst({
    where: { username },
    select: {
      id: true,
      fullname: true,
      username: true,
      avatar: true,
      email: true,
      created_at: true,
      updated_at: true,
    },
  });

  return parseUserData(user);
};

export const createUser = async (userData) => {
  const { role, ...userFields } = userData;

  const data = {
    ...userFields,
    role_id: ROLE_STRING_TO_INT[role] || 1, // Default to USER if role is not recognized,
  };

  const createdUser = await prisma.user_app.create({
    data,
    select: {
      id: true,
      fullname: true,
      username: true,
      avatar: true,
      email: true,
      created_at: true,
      updated_at: true,
    },
  });

  return parseUserData(createdUser);
};

export const updateUser = async (id, userData) => {
  const { role, ...userFields } = userData;

  let data = { ...userFields };

  // Convert role string to roleId if provided
  if (role) {
    data.role_id = ROLE_STRING_TO_INT[role] || 1; // Default to USER if role is not recognized
  }

  const updatedUser = await prisma.user_app.update({
    where: {
      id: parseInt(id),
    },
    data,
    select: {
      id: true,
      fullname: true,
      username: true,
      email: true,
      created_at: true,
      updated_at: true,
    },
  });

  return parseUserData(updatedUser);
};

export const deleteUser = async (id) => {
  const deletedUser = await prisma.user_app.delete({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      fullname: true,
      username: true,
      avatar: true,
      email: true,
      created_at: true,
      updated_at: true,
    },
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
      id: true,
      fullname: true,
      username: true,
      avatar: true,
      email: true,
      created_at: true,
      updated_at: true,
      role: { select: { value: true } },
    },
  });

  return parseUserData(user);
};
