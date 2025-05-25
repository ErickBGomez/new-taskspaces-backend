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
import tagValidator from '../validators/tag.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import * as tagController from '../controllers/tag.controller.js';

const router = Router();

router.get(
  '/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.SYSADMIN),
  tagController.getAllTags
);
router.get(
  '/p/:projectId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.PROJECT),
  tagController.getTagsByProjectId
);
router.get(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.TAG),
  tagController.getTagById
);
router.get(
  '/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.TASK),
  tagController.getTagsByTaskId
);
router.post(
  '/p/:projectId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.PROJECT),
  tagValidator,
  checkValidation,
  tagController.createTag
);
router.put(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TAG),
  tagValidator,
  checkValidation,
  tagController.updateTag
);
router.delete(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TAG),
  tagController.deleteTag
);
router.post(
  '/:id/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TAG),
  // ?: Validate this?
  tagController.assignTagToTask
);
router.delete(
  '/:id/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TAG),
  tagController.unassignTagFromTask
);

export default router;
