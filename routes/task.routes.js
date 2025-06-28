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
import { taskValidator } from '../validators/task.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import * as taskController from '../controllers/task.controller.js';
import handleInternalServerErrorMiddleware from '../middlewares/internal-server-error.middleware.js';

const router = Router();

router.get(
  '/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.SYSADMIN),
  taskController.getAllTasks,
  handleInternalServerErrorMiddleware
);
router.get(
  '/p/:projectId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.PROJECT),
  taskController.getTasksByProjectId,
  handleInternalServerErrorMiddleware
);
router.get(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.READER, DEPTH.TASK),
  taskController.getTaskById,
  handleInternalServerErrorMiddleware
);
router.post(
  '/p/:projectId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.PROJECT),
  taskValidator,
  checkValidation,
  taskController.createTask,
  handleInternalServerErrorMiddleware
);
router.put(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TASK),
  taskValidator,
  checkValidation,
  taskController.updateTask,
  handleInternalServerErrorMiddleware
);
router.delete(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TASK),
  taskController.deleteTask,
  handleInternalServerErrorMiddleware
);
// Task assigned members
router.get(
  '/:id/members',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  taskController.getAssignedMembersByTaskId,
  handleInternalServerErrorMiddleware
);
router.get(
  '/:id/members/w/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TASK),
  taskController.getWorkspaceMembersByTaskId,
  handleInternalServerErrorMiddleware
);
router.post(
  '/:id/members/:memberId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TASK),
  taskController.assignMemberToTask,
  handleInternalServerErrorMiddleware
);
router.delete(
  '/:id/members/:memberId',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  checkMemberRoleMiddleware(MEMBER_ROLES.COLLABORATOR, DEPTH.TASK),
  taskController.unassignMemberToTask,
  handleInternalServerErrorMiddleware
);

export default router;
