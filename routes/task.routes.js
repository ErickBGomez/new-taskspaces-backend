import * as taskController from '../controllers/task.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import taskValidator from '../validators/task.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import express from 'express';
import taskRolesMiddleware from '../middlewares/task-roles.middleware.js';

const router = express.Router();

router.get('/p/:projectId', authMiddleware, taskController.getAllTasks);
router.get('/:id/p/:projectId', authMiddleware, taskController.getTaskById);
router.post(
  '/p/:projectId',
  authMiddleware,
  taskRolesMiddleware,
  taskValidator,
  checkValidation,
  taskController.createTask
);
router.put(
  '/:id/p/:projectId',
  authMiddleware,
  taskRolesMiddleware,
  taskValidator,
  checkValidation,
  taskController.updateTask
);
router.delete(
  '/:id/p/:projectId',
  authMiddleware,
  taskRolesMiddleware,
  taskController.deleteTask
);

export default router;
