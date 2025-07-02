import { body } from 'express-validator';

export const createProjectValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 25 })
    .withMessage('Title must be less than 25 characters'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
];

export const updateProjectValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 25 })
    .withMessage('Title must be less than 25 characters'),
  body('statuses')
    .optional()
    .isArray()
    .withMessage('Statuses must be an array'),
  body('tags').optional().isArray().withMessage('Statuses must be an array'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
];
