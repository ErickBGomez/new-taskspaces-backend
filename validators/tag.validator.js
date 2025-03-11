import { body } from 'express-validator';

const tagValidator = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 1, max: 25 })
    .withMessage('Title must be between 1 and 25 characters'),
  body('color')
    .isString()
    .withMessage('Color must be a string')
    .isLength({ min: 7, max: 7 })
    .withMessage('Color must be a valid hex color'),
];

export default tagValidator;
