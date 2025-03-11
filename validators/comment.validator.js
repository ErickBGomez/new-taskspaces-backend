import { body } from 'express-validator';

const commentValidator = [
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string'),
];

export default commentValidator;
