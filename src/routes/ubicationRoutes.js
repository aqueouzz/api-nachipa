import { Router } from 'express';
import {
  createUbication,
  getAllUbication,
  getUbication,
  deleteUbication,
  updateUbication,
} from '../controllers/ubicationController.js';

const router = Router();

router.route('/').post(createUbication).get(getAllUbication);
router
  .route('/:id')
  .get(getUbication)
  .delete(deleteUbication)
  .put(updateUbication);

export default router;
