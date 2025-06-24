import { body } from 'express-validator';

export const taskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  body('description')
    .optional()
    .custom((value) => {
      if (value === null || typeof value === 'string') {
        return true;
      }
      throw new Error('Description must be a string or null');
    }),
  body('status')
    .optional()
    .custom((value) => {
      if (value === null || typeof value === 'string') {
        return true;
      }
      throw new Error('Status must be a string or null');
    })
    .isIn(['PENDING', 'DOING', 'DONE'])
    .withMessage('Status must be one of the following: PENDING, DOING, DONE'),
  body('deadline').optional(),
  body('timer').optional(),
];
