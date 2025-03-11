import { body } from 'express-validator';

const projectValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 3, max: 25 })
    .withMessage('Title must be between 3 and 25 characters long'),
  body('statuses')
    .optional()
    .isArray()
    .withMessage('Statuses must be an array'),
  body('tags').optional().isArray().withMessage('Statuses must be an array'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
];

export default projectValidator;
