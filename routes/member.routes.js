import { Router } from 'express';
import * as memberController from '../controllers/member.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import handleInternalServerErrorMiddleware from '../middlewares/internal-server-error.middleware.js';

const router = Router();

router.get(
  '/w/:workspaceId',
  authMiddleware,
  memberController.getMemberRoleByWorkspaceId,
  handleInternalServerErrorMiddleware
);
router.get(
  '/p/:projectId',
  authMiddleware,
  memberController.getMemberRoleByProjectId,
  handleInternalServerErrorMiddleware
);
router.get(
  '/t/:taskId',
  authMiddleware,
  memberController.getMemberRoleByTaskId,
  handleInternalServerErrorMiddleware
);

export default router;
