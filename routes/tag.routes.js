import * as tagController from '../controllers/tag.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import tagValidator from '../validators/tag.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import express from 'express';

const router = express.Router();

router.get('/p/:projectId', authMiddleware, tagController.getAllTags);
router.get('/:id/p/:projectId', authMiddleware, tagController.getTagById);
router.post(
  '/p/:projectId',
  authMiddleware,
  tagValidator,
  checkValidation,
  tagController.createTag
);
router.post('/:id/t/:taskId', authMiddleware, tagController.assignTagToTask);
router.put(
  '/:id/p/:projectId',
  authMiddleware,
  tagValidator,
  checkValidation,
  tagController.updateTag
);
router.delete('/:id/p/:projectId', authMiddleware, tagController.deleteTag);

export default router;
