import * as projectController from '../controllers/project.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import express from 'express';
import projectValidator from '../validators/project.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import projectRolesMiddleware from '../middlewares/project-roles.middleware.js';

const router = express.Router();

router.get('/w/:workspaceId', authMiddleware, projectController.getAllProjects);
router.get(
  '/:id/w/:workspaceId',
  authMiddleware,
  projectController.getProjectById
);
router.post(
  '/w/:workspaceId',
  authMiddleware,
  projectRolesMiddleware,
  projectValidator,
  checkValidation,
  projectController.createProject
);
router.put(
  '/:id/w/:workspaceId',
  authMiddleware,
  // projectRolesMiddleware,
  projectValidator,
  checkValidation,
  projectController.updateProject
);
router.delete(
  '/:id/w/:workspaceId',
  authMiddleware,
  projectRolesMiddleware,
  projectController.deleteProject
);

export default router;
