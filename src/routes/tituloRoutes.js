import { Router } from 'express';
import {
  createTitulo,
  getAllTitulos,
  getByID,
  updateTitulo,
  deleteTitulo,
} from '../controllers/tituloController.js';

// Middleware de Authentication
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';

const router = Router();

router
  .route('/')
  .post(authenticateToken, createTitulo)
  .get(authenticateToken, getAllTitulos);
router
  .route('/:id')
  .get(authenticateToken, getByID)
  .patch(authenticateToken, updateTitulo)
  .delete(authenticateToken, deleteTitulo);

export default router;
