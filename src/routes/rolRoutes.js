import { Router } from 'express';
import {
  createRol,
  getAllRoles,
  getRolById,
  updateRol,
  deleteRol,
} from '../controllers/rolController.js';

// Middleware de Authentication
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';

const router = Router();

router
  .route('/')
  .post(authenticateToken, createRol)
  .get(authenticateToken, getAllRoles);
router
  .route('/:id')
  .get(authenticateToken, getRolById)
  .patch(authenticateToken, updateRol)
  .delete(authenticateToken, deleteRol);

export default router;
