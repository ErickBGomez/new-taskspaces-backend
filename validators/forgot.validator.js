import { body } from 'express-validator';

export const resetUserValidator = [
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password must contain at least one uppercase, one lowercase, one number and one special character'
    ),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required'),
];

export const forgotUserValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];
