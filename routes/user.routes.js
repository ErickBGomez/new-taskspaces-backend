import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  authorizeRolesMiddleware,
  ROLES,
} from '../middlewares/authorize-roles.middleware.js';
import { registerUserValidator } from '../validators/user.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import * as userController from '../controllers/user.controller.js';
import handleInternalServerErrorMiddleware from '../middlewares/internal-server-error.middleware.js';

/*
  I've considered separating the actions into an admin-only method and a user-only method
  in the controller. However, since many routes are similar, they will conflict. That's why
  it's better to have the ID as a mandatory part of some routes, such as PUT /:id and GET /:id,
  rather than just / (since they can conflict with the admin-only GET / route).
*/

const router = Router();

router.get(
  '/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.SYSADMIN),
  userController.getAllUsers,
  handleInternalServerErrorMiddleware
);
// Test deletion user
router.get(
  '/delete',
  userController.deleteUserTest,
  handleInternalServerErrorMiddleware
);
router.get(
  '/u/:username',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  userController.getUserByUsername,
  handleInternalServerErrorMiddleware
);
router.get(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  userController.getUserById,
  handleInternalServerErrorMiddleware
);
router.post(
  '/register',
  registerUserValidator,
  checkValidation,
  userController.registerUser,
  handleInternalServerErrorMiddleware
);
router.post(
  '/login',
  userController.loginUser,
  handleInternalServerErrorMiddleware
);
router.post(
  '/forgot-password',
  userController.forgotPassword,
  handleInternalServerErrorMiddleware
);
router.put(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  userController.updateUser,
  handleInternalServerErrorMiddleware
);
router.put(
  '/:id/password',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  userController.updatePassword,
  handleInternalServerErrorMiddleware
);
router.delete(
  '/:id',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  userController.deleteUser,
  handleInternalServerErrorMiddleware
);

export default router;
