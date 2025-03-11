import express from 'express';
import authController from '../controllers/auth.controller.js';
import { resetUserValidator, forgotUserValidator } from '../validators/forgot.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';

const router = express.Router();

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', resetUserValidator, authController.resetPassword);


export default router;
