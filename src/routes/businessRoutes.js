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

const router = Router();

router.get('/', getAllBusiness);
router.post('/', validateRegisterBusinessInput, createBusiness);
router
  .route('/:id')
  .all(validateIdParam)
  .get(getById)
  .patch(updateBusiness)
  .delete(deleteBusiness);

export default router;
