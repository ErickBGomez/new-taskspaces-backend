import { Router } from 'express';
import { upload } from '../helpers/multer.helper.js';
import { uploadMedia } from '../repositories/media.repository.js';

const router = Router();

router.post('/upload', upload.single('image'), uploadMedia);

export default router;
