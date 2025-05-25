import { Router } from 'express';
import * as bookmarkController from '../controllers/bookmark.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  authorizeRolesMiddleware,
  ROLES,
} from '../middlewares/authorize-roles.middleware.js';
import handleInternalServerErrorMiddleware from '../middlewares/internal-server-error.middleware.js';
import {
  checkMemberRoleMiddleware,
  DEPTH,
  MEMBER_ROLES,
} from '../middlewares/check-member-role.middleware.js';

const router = Router();

router.get(
  '/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  bookmarkController.getUserBookmarks,
  handleInternalServerErrorMiddleware
);
router.get(
  '/all',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.SYSADMIN),
  bookmarkController.getAllBookmarks,
  handleInternalServerErrorMiddleware
);
router.get(
  '/all/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.SYSADMIN),
  bookmarkController.getBookmarksByTaskId,
  handleInternalServerErrorMiddleware
);
router.get(
  '/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  bookmarkController.getBookmarkByTaskId,
  handleInternalServerErrorMiddleware
);
router.post(
  '/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TASK),
  bookmarkController.createBookmark,
  handleInternalServerErrorMiddleware
);
router.delete(
  '/t/:taskId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  bookmarkController.deleteBookmark,
  handleInternalServerErrorMiddleware
);

export default router;
