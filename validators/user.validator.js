import { body } from 'express-validator';

export const registerUserValidator = [
  body('fullname')
    .notEmpty()
    .withMessage('Fullname is required')
    .isString()
    .withMessage('Fullname must be a string')
    .isLength({ min: 3 })
    .withMessage('Fullname must be at least 3 characters long')
    .matches(/^[\p{L}\s]+$/u)
    .withMessage('Fullname must not contain numbers or special characters'),
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters long')
    .matches(/^(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
    .withMessage(
      'Username must not contain special characters except for _ and .'
    ),
  body('avatar')
    .optional()
    .isString()
    .withMessage('Avatar must be a string')
    .isURL()
    .withMessage('Avatar must be a URL'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
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

export const loginUserValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];
