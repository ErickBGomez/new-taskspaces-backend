import mongoose from 'mongoose';
import config from './config.js';

export const connect = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Database connected');
  } catch (e) {
    console.error('Database connection failed:', e);
    throw e;
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('Database disconnected');
  } catch (e) {
    console.error('Database disconnection failed:', e);
    throw e;
  }
};
