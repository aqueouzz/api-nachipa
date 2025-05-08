import { Router } from 'express';
import {
  createRol,
  getAllRoles,
  getRolById,
  updateRol,
  deleteRol,
} from '../controllers/rolController.js';

const router = Router();

router.route('/').post(createRol).get(getAllRoles);
router.route('/:id').get(getRolById).patch(updateRol).delete(deleteRol);

export default router;
