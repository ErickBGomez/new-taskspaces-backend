import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import commentValidator from '../validators/comment.validator.js';
import checkValidation from '../middlewares/validator.middleware.js';
import * as commentController from '../controllers/comment.controller.js';

const router = Router();

router.get('/t/:taskId', authMiddleware, commentController.getAllComments);
router.get('/:id/t/:taskId', authMiddleware, commentController.getCommentById);
router.post(
  '/t/:taskId',
  authMiddleware,
  commentValidator,
  checkValidation,
  commentController.createComment
);
router.put(
  '/:id/t/:taskId',
  authMiddleware,
  commentValidator,
  checkValidation,
  commentController.updateComment
);
router.delete(
  '/:id/t/:taskId',
  authMiddleware,
  commentController.deleteComment
);

export default router;
