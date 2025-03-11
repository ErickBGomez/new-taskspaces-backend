import * as workspaceController from '../controllers/workspace.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  inviteValidator,
  workspaceValidator,
} from '../validators/workspace.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import express from 'express';

const router = express.Router();

router.get(
  '/check',
  authMiddleware,
  workspaceController.checkWorkspaceAvailability
);
router.get('/', authMiddleware, workspaceController.getAllWorkspaces);
router.get('/:id/', authMiddleware, workspaceController.getWorkspaceById);
router.get('/u/:userId', workspaceController.getWorkspacesByOwnerId);
router.get('/:id/u/:userId', workspaceController.getWorkspaceByOwnerId);
router.post(
  '/',
  authMiddleware,
  workspaceValidator,
  checkValidation,
  workspaceController.createWorkspace
);
router.put(
  '/:id/member/:username',
  authMiddleware,
  inviteValidator,
  checkValidation,
  workspaceController.inviteMember
);
router.put(
  '/:id',
  authMiddleware,
  workspaceValidator,
  checkValidation,
  workspaceController.updateWorkspace
);
router.delete(
  '/:id/member/:username',
  authMiddleware,
  workspaceController.removeMember
);
router.delete('/:id', authMiddleware, workspaceController.deleteWorkspace);

export default router;
