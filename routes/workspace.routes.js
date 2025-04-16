import * as workspaceController from '../controllers/workspace.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  inviteValidator,
  workspaceValidator,
} from '../validators/workspace.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import express from 'express';
import {
  authorizeRolesMiddleware,
  ROLES,
} from '../middlewares/authorize-roles.middleware.js';
import {
  checkMemberRoleMiddleware,
  DEPTH,
  MEMBER_ROLES,
} from '../middlewares/check-member-role.middleware.js';

const router = express.Router();

router.get(
  '/check',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  workspaceController.checkWorkspaceAvailability
);
// TODO: Define get all workspaces (admin)
router.get(
  '/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  workspaceController.getAllWorkspaces
);
router.get(
  '/:id/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.WORKSPACE),
  workspaceController.getWorkspaceById
);
router.get(
  '/u/:userId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.WORKSPACE),
  workspaceController.getWorkspacesByOwnerId
);
router.get(
  '/:id/u/:userId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.WORKSPACE),
  workspaceController.getWorkspaceByOwnerId
);
// TODO: Define create workspace (admin)
router.post(
  '/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  workspaceValidator,
  checkValidation,
  workspaceController.createWorkspace
);
router.put(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  workspaceValidator,
  checkValidation,
  workspaceController.updateWorkspace
);
router.delete(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  workspaceController.deleteWorkspace
);

// Members
router.get(
  '/:id/members/:memberId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.WORKSPACE),
  workspaceController.getMemberRole
);
router.post(
  '/:id/members',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  inviteValidator,
  checkValidation,
  workspaceController.inviteMember
);
router.put(
  '/:id/members/:username',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  inviteValidator,
  checkValidation,
  workspaceController.updateMember
);
router.delete(
  '/:id/members/:username',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  workspaceController.removeMember
);

export default router;
