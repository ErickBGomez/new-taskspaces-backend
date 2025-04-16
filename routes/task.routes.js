import * as taskController from '../controllers/task.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import taskValidator from '../validators/task.validator.js';
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
  '/p/:projectId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.PROJECT),
  taskController.getAllTasks
);
router.get(
  '/:id/p/:projectId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.PROJECT),
  taskController.getTaskById
);
router.post(
  '/p/:projectId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.PROJECT),
  taskValidator,
  checkValidation,
  taskController.createTask
);
router.put(
  '/:id/p/:projectId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TASK),
  taskValidator,
  checkValidation,
  taskController.updateTask
);
router.delete(
  '/:id/p/:projectId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TASK),
  taskController.deleteTask
);

export default router;
