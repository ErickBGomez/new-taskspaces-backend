import { Router } from 'express';
import { uploadMediaToTask } from '../controllers/media.controller.js';
import uploadImageMiddleware from '../middlewares/upload-image.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/upload/t/:taskId',
  authMiddleware,
  uploadImageMiddleware,
  uploadMediaToTask
);

router.post(
  '/upload/',
  authMiddleware,
  uploadImageMiddleware,
  uploadMediaToTask
);

export default router;
