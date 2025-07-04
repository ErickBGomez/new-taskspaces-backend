import { Router } from 'express';
import {
  uploadMediaToTask,
  uploadMedia,
} from '../controllers/media.controller.js';
import uploadImageMiddleware from '../middlewares/upload-image.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/upload/t/:taskId',
  authMiddleware,
  uploadImageMiddleware,
  uploadMediaToTask
);

router.post('/upload/', uploadImageMiddleware, uploadMedia);

export default router;
