import { Router } from 'express';
import { searchAll } from '../controllers/search.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  authorizeRolesMiddleware,
  ROLES,
} from '../middlewares/authorize-roles.middleware.js';
import handleInternalServerErrorMiddleware from '../middlewares/internal-server-error.middleware.js';

const router = Router();

router.get(
  '/',
  authMiddleware,
  authorizeRolesMiddleware(ROLES.USER),
  searchAll,
  handleInternalServerErrorMiddleware
);

export default router;
