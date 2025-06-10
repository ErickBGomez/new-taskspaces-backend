import { Router } from 'express';
import { uploadMedia } from '../controllers/media.controller.js';
import uploadImageMiddleware from '../middlewares/upload-image.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/upload/:taskId',
  authMiddleware,
  uploadImageMiddleware,
  uploadMedia
);

export default router;
