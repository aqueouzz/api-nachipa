import { Router } from 'express';
import {
  getAllAreas,
  createArea,
  getAreaById,
  updateArea,
  deleteArea,
} from '../controllers/areaController.js';

const router = Router();

router.route('/').get(getAllAreas).post(createArea);

router.route('/:id').get(getAreaById).patch(updateArea).delete(deleteArea);

export default router;
