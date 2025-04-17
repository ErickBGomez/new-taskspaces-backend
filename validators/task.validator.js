import { body } from 'express-validator';
import mongoose from 'mongoose';

const taskValidator = [
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
    .isIn(['pending', 'doing', 'done'])
    .withMessage('Status must be one of the following: pending, doing, done'),
  // TODO: Implement tags model correctly
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings')
    .custom((tags) => tags.every((tag) => typeof tag === 'string'))
    .withMessage('Each tag must be valid'),
  // TODO: Check data type
  body('date').optional().isString().withMessage('Date must be a string'),
  body('timer')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Timer must be a non-negative integer'),
  body('assignedMembers')
    .optional()
    .isArray()
    .withMessage('Members must be an array of ObjectIds')
    .custom((members) =>
      members.every((member) => mongoose.Types.ObjectId.isValid(member))
    )
    .withMessage('Each member must be a valid ObjectId'),
];

export default taskValidator;
