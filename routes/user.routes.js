import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { registerUserValidator } from '../validators/user.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post(
  '/register',
  registerUserValidator,
  checkValidation,
  userController.registerUser
);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.put('/:id', userController.updateUser);
router.put('/:id/password', userController.updatePassword);
router.delete('/:id', userController.deleteUser);

export default router;
