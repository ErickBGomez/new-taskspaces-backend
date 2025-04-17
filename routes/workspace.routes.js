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

const router = Router();

router.get(
  '/check',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  workspaceController.checkWorkspaceAvailability
);
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
// This route cannot be checked by the middleware checkMemberRoleMiddleware,
// because there is no way to obtain the id of a specific workspace
router.get(
  '/u/:userId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  workspaceController.getWorkspacesByOwnerId
);
// TODO: Define create workspace to another user (admin)
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
  '/:id/members',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.WORKSPACE),
  workspaceController.getMembers
);
// Gets just member role, not the whole user information
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
  '/:id/members/:memberId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  updateMemberValidator,
  checkValidation,
  workspaceController.updateMember
);
router.delete(
  '/:id/members/:memberId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.ADMIN, DEPTH.WORKSPACE),
  workspaceController.removeMember
);

export default router;
