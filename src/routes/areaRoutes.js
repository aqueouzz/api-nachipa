import { Router } from 'express';
import {
  getAllAreas,
  createArea,
  getAreaById,
  updateArea,
  deleteArea,
} from '../controllers/areaController.js';

// Middleware de Authentication
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizedMiddleware } from '../middlewares/authorizedMiddleware.js';

const router = Router();

router
  .route('/')
  .all(authenticateToken, authorizedMiddleware)
  .get(getAllAreas)
  .post(createArea);

router
  .route('/:id')
  .all(authenticateToken)
  .get(getAreaById)
  .patch(updateArea)
  .delete(deleteArea);

export default router;
