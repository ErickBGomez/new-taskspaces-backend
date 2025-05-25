import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  authorizeRolesMiddleware,
  ROLES,
} from '../middlewares/authorize-roles.middleware.js';
import {
  checkMemberRoleMiddleware,
  DEPTH,
  MEMBER_ROLES,
} from '../middlewares/check-member-role.middleware.js';
import commentValidator from '../validators/comment.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import * as commentController from '../controllers/comment.controller.js';
import handleInternalServerErrorMiddleware from '../middlewares/internal-server-error.middleware.js';

const router = Router();

router.get(
  '/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.SYSADMIN),
  commentController.getAllComments,
  handleInternalServerErrorMiddleware
);
router.get(
  '/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.TASK),
  commentController.getCommentsByTaskId,
  handleInternalServerErrorMiddleware
);
router.get(
  '/:id/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.TASK),
  commentController.getCommentById,
  handleInternalServerErrorMiddleware
);
router.post(
  '/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TASK),
  commentValidator,
  checkValidation,
  commentController.createComment,
  handleInternalServerErrorMiddleware
);
router.put(
  '/:id/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TASK),
  commentValidator,
  checkValidation,
  commentController.updateComment,
  handleInternalServerErrorMiddleware
);
router.delete(
  '/:id/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TASK),
  commentController.deleteComment,
  handleInternalServerErrorMiddleware
);

export default router;
