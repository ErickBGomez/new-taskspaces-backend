import User from '../models/user.model.js';

// TODO: Document these lines
export const findAllUsers = async () => {
  return await User.find().select('-password -role');
};

export const findUserById = async (id) => {
  return await User.findById(id).select('-password -role');
};

export const findUserByEmail = async (email, exposeSensitive = false) => {
  if (exposeSensitive) return await User.findOne({ email });

  return await User.findOne({ email }).select('-password -role');
};

export const findUserByUsername = async (username) => {
  return await User.findOne({ username }).select('-password -role');
};

export const createUser = async (user) => {
  return await User.create(user).select('-password -role');
};

export const updateUser = async (id, user) => {
  return await User.findByIdAndUpdate(id, user, { new: true }).select(
    '-password -role'
  );
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id).select('-password -role');
};
