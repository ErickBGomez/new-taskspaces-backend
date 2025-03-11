import { body } from 'express-validator';
import mongoose from 'mongoose';

const taskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  body('status')
    .optional()
    .isString()
    .withMessage('Status must be a string')
    .isIn(['pending', 'doing', 'done'])
    .withMessage('Status must be one of the following: pending, doing, done'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('media')
    .optional()
    .isArray()
    .withMessage('Media must be an array of strings')
    .custom((media) => media.every((item) => typeof item === 'string'))
    .withMessage('Each media item must be a string'),
  body('date').optional(),
  body('timer')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Timer must be a non-negative integer'),
  body('members')
    .optional()
    .isArray()
    .withMessage('Members must be an array of ObjectIds')
    .custom((members) =>
      members.every((member) => mongoose.Types.ObjectId.isValid(member))
    )
    .withMessage('Each member must be a valid ObjectId'),
];

export default taskValidator;
