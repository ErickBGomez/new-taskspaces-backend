import prisma from '../utils/prisma.js';
import { ROLE_STRING_TO_INT } from '../utils/user.utils.js';

export const findAllUsers = async () => {
  return await prisma.user_app.findMany({
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
};

export const findUserById = async (id) => {
  return await prisma.user_app.findUnique({
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
};

export const findUserByEmail = async (email, exposeSensitive = false) => {
  if (exposeSensitive) {
    return await prisma.user_app.findFirst({
      where: { email },
      select: {
        id: true,
        fullname: true,
        username: true,
        avatar: true,
        email: true,
        created_at: true,
        updated_at: true,
        role: {
          value: true,
        },
      },
    });
  }

  return await prisma.user_app.findFirst({
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
};

export const findUserByUsername = async (username) => {
  return await prisma.user_app.findFirst({
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

  return createdUser;
};

export const updateUser = async (id, userData) => {
  const { role, ...userFields } = userData;

  let data = { ...userFields };

  // Convert role string to roleId if provided
  if (role) {
    data.role_id = ROLE_STRING_TO_INT[role] || 1; // Default to USER if role is not recognized
  }

  return await prisma.user_app.update({
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
};

export const deleteUser = async (id) => {
  return await prisma.user_app.delete({
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
};

// Helper function to find user with password for authentication
export const findUserWithPasswordById = async (id) => {
  return await prisma.user_app.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      role: true,
    },
  });
};
