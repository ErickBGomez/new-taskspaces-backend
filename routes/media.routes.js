import { Router } from 'express';
import { uploadMedia } from '../controllers/media.controller.js';
import uploadImageMiddleware from '../middlewares/upload-image.middleware.js';

const router = Router();

router.post('/upload', uploadImageMiddleware, uploadMedia);

export default router;
