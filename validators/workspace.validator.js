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
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin', 'collaborator', 'reader'])
    .withMessage('Role must be either admin, collaborator, or reader'),
];
