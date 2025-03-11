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
