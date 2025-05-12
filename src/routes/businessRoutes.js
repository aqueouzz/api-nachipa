import { Router } from 'express';
import {
  createBusiness,
  getAllBusiness,
  getById,
  updateBusiness,
  deleteBusiness,
} from '../controllers/businessController.js';
import { validateRegisterBusinessInput } from '../middlewares/validationMiddleware.js';
import { validateIdParam } from '../middlewares/validateIdParams.js';

// Middleware de Authentication
import {
  authorizedMiddleware,
  authorizeAction,
} from '../middlewares/authorizedMiddleware.js';
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizedMiddleware,
  authorizeAction('read'),
  getAllBusiness
);
router.post(
  '/',
  authenticateToken,
  authorizedMiddleware,
  validateRegisterBusinessInput,
  createBusiness
);
router
  .route('/:id')
  .all(authenticateToken, validateIdParam)
  .get(getById)
  .patch(updateBusiness)
  .delete(deleteBusiness);

export default router;
