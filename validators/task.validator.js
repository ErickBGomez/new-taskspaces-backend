import { body } from 'express-validator';

export const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('status')
    .optional()
    .isString()
    .withMessage('Status must be a string')
    .isIn(['PENDING', 'DOING', 'DONE'])
    .withMessage('Status must be one of the following: PENDING, DOING, DONE'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date format'),
  body('timer')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Timer must be a non-negative integer'),
];

export const updateTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('status')
    .optional()
    .isString()
    .withMessage('Status must be a string')
    .isIn(['PENDING', 'DOING', 'DONE'])
    .withMessage('Status must be one of the following: PENDING, DOING, DONE'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date format'),
  body('timer')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Timer must be a non-negative integer'),
];
