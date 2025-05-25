import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  authorizeRolesMiddleware,
  ROLES,
} from '../middlewares/authorize-roles.middleware.js';
import {
  checkMemberRoleMiddleware,
  MEMBER_ROLES,
  DEPTH,
} from '../middlewares/check-member-role.middleware.js';
import {
  createProjectValidator,
  updateProjectValidator,
} from '../validators/project.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import * as projectController from '../controllers/project.controller.js';

const router = Router();

router.get(
  '/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.SYSADMIN),
  projectController.getAllProjects
);
router.get(
  '/w/:workspaceId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.WORKSPACE),
  projectController.getProjectsByWorkspaceId
);
router.get(
  '/:id',
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
  createProjectValidator,
  checkValidation,
  projectController.createProject
);
router.put(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.PROJECT),
  updateProjectValidator,
  checkValidation,
  projectController.updateProject
);
router.delete(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.PROJECT),
  projectController.deleteProject
);

export default router;
