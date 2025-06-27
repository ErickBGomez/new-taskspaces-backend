import authMiddleware from '../middlewares/auth.middleware.js';
import { Router } from 'express';
import {
  authorizeRolesMiddleware,
  ROLES,
} from '../middlewares/authorize-roles.middleware.js';
import {
  checkMemberRoleMiddleware,
  DEPTH,
  MEMBER_ROLES,
} from '../middlewares/check-member-role.middleware.js';
import {
  inviteValidator,
  updateMemberValidator,
  workspaceValidator,
} from '../validators/workspace.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import * as workspaceController from '../controllers/workspace.controller.js';
import handleInternalServerErrorMiddleware from '../middlewares/internal-server-error.middleware.js';

const router = Router();

router.get(
  '/check',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  workspaceController.checkWorkspaceAvailability,
  handleInternalServerErrorMiddleware
);
router.get(
  '/shared',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  workspaceController.getSharedWorkspaces,
  handleInternalServerErrorMiddleware
);
router.get(
  '/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.SYSADMIN),
  workspaceController.getAllWorkspaces,
  handleInternalServerErrorMiddleware
);
router.get(
  '/:id/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.WORKSPACE),
  workspaceController.getWorkspaceById,
  handleInternalServerErrorMiddleware
);
// This route cannot be checked by the middleware checkMemberRoleMiddleware,
// because there is no way to obtain the id of a specific workspace
router.get(
  '/u/:userId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  workspaceController.getWorkspacesByOwnerId,
  handleInternalServerErrorMiddleware
);
// TODO: Define create workspace to another user (admin)
router.post(
  '/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  workspaceValidator,
  checkValidation,
  workspaceController.createWorkspace,
  handleInternalServerErrorMiddleware
);
router.put(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  workspaceValidator,
  checkValidation,
  workspaceController.updateWorkspace,
  handleInternalServerErrorMiddleware
);
router.delete(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  workspaceController.deleteWorkspace,
  handleInternalServerErrorMiddleware
);

// Members
router.get(
  '/:id/members',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.WORKSPACE),
  workspaceController.getMembers,
  handleInternalServerErrorMiddleware
);
router.post(
  '/:id/members',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  inviteValidator,
  checkValidation,
  workspaceController.inviteMember,
  handleInternalServerErrorMiddleware
);
router.put(
  '/:id/members/:memberId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  updateMemberValidator,
  checkValidation,
  workspaceController.updateMember,
  handleInternalServerErrorMiddleware
);
router.delete(
  '/:id/members/:memberId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  workspaceController.removeMember,
  handleInternalServerErrorMiddleware
);

export default router;
