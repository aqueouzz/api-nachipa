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

const router = Router();

router.route('/').all(authenticateToken).get(getAllAreas).post(createArea);

router.route('/:id').get(getAreaById).patch(updateArea).delete(deleteArea);

export default router;
