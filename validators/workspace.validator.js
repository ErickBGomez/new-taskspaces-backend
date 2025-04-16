import { body } from 'express-validator';

export const workspaceValidator = [
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 25 })
    .withMessage('Title must be less than 25 characters'),
];

export const inviteValidator = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string'),
  body('memberRole')
    .notEmpty()
    .withMessage('Member role is required')
    .isString()
    .withMessage('Member role must be a string')
    .isIn(['ADMIN', 'COLLABORATOR', 'READER'])
    .withMessage('Member role must be either ADMIN, COLLABORATOR, or READER'),
];

export const updateMemberValidator = [
  body('memberRole')
    .notEmpty()
    .withMessage('Member role is required')
    .isString()
    .withMessage('Member role must be a string')
    .isIn(['ADMIN', 'COLLABORATOR', 'READER'])
    .withMessage('Member role must be either ADMIN, COLLABORATOR, or READER'),
];
