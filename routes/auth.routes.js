import { Router } from 'express';
import {
  resetUserValidator,
  forgotUserValidator,
} from '../validators/forgot.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import authController from '../controllers/auth.controller.js';

// TODO: include validators

const router = Router();

router.post('/forgot-password', authController.forgotPassword);
router.post(
  '/reset-password',
  resetUserValidator,
  authController.resetPassword
);

export default router;
