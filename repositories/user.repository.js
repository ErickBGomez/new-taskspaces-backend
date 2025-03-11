import User from '../models/user.model.js';

// TODO: Document these lines
export const findAllUsers = async () => {
  return await User.find();
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

export const createUser = async (user) => {
  return await User.create(user);
};

export const updateUser = async (id, user) => {
  return await User.findByIdAndUpdate(id, user, { new: true });
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
