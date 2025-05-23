import prisma from '../utils/prisma.js';

// Find all users (excluding password and role for security)
export const findAllUsers = async () => {
  return await prisma.user_app.findMany({
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

// Find user by ID (excluding password and role by default)
export const findUserById = async (id) => {
  return await prisma.user_app.findUnique({
    where: {
      id: parseInt(id),
    },
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

// Find user by email with option to expose sensitive data
export const findUserByEmail = async (email, exposeSensitive = false) => {
  if (exposeSensitive) {
    return await prisma.user_app.findFirst({
      where: { email },
      include: {
        role: true,
      },
    });
  }

  return await prisma.user_app.findFirst({
    where: { email },
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

// Find user by username (excluding password and role)
export const findUserByUsername = async (username) => {
  return await prisma.user_app.findFirst({
    where: { username },
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

// Create user
export const createUser = async (userData) => {
  const { role, ...userFields } = userData;

  // Convert role string to roleId
  let role_id = 1; // Default to USER
  if (role === 'SYSADMIN') {
    role_id = 2;
  }

  const createdUser = await prisma.user_app.create({
    data: {
      ...userFields,
      role_id,
    },
    select: {
      id: true,
      fullname: true,
      username: true,
      email: true,
      created_at: true,
      updated_at: true,
    },
  });

  return createdUser;
};

// Update user
export const updateUser = async (id, userData) => {
  const { role, ...userFields } = userData;

  let updated_ata = { ...userFields };

  // Convert role string to roleId if provided
  if (role) {
    updated_ata.roleId = role === 'SYSADMIN' ? 2 : 1;
  }

  return await prisma.user_app.update({
    where: {
      id: parseInt(id),
    },
    data: updated_ata,
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

// Delete user
export const deleteUser = async (id) => {
  return await prisma.user_app.delete({
    where: {
      id: parseInt(id),
    },
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
