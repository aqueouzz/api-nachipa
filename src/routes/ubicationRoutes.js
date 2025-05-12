import { Router } from 'express';
import {
  createUbication,
  getAllUbication,
  getUbication,
  deleteUbication,
  updateUbication,
} from '../controllers/ubicationController.js';

// Middleware de Authentication
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';

const router = Router();

router
  .route('/')
  .post(authenticateToken, createUbication)
  .get(authenticateToken, getAllUbication);
router
  .route('/:id')
  .get(authenticateToken, getUbication)
  .delete(authenticateToken, deleteUbication)
  .patch(authenticateToken, updateUbication);

export default router;
