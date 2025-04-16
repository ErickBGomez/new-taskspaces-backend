import * as projectController from '../controllers/project.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import express from 'express';
import projectValidator from '../validators/project.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import {
  authorizeRolesMiddleware,
  ROLES,
} from '../middlewares/authorize-roles.middleware.js';
import {
  checkMemberRoleMiddleware,
  MEMBER_ROLES,
  DEPTH,
} from '../middlewares/check-member-role.middleware.js';

const router = express.Router();

router.get(
  '/w/:workspaceId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  projectController.getAllProjects
);
router.get(
  '/:id/w/:workspaceId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.PROJECT),
  projectController.getProjectById
);
router.post(
  '/w/:workspaceId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  projectValidator,
  checkValidation,
  projectController.createProject
);
router.put(
  '/:id/w/:workspaceId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.PROJECT),
  projectValidator,
  checkValidation,
  projectController.updateProject
);
router.delete(
  '/:id/w/:workspaceId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.PROJECT),
  projectController.deleteProject
);

export default router;
