import { Router } from 'express';
import {
  createTitulo,
  getAllTitulos,
  getByID,
  updateTitulo,
  deleteTitulo,
} from '../controllers/tituloController.js';

const router = Router();

router.route('/').post(createTitulo).get(getAllTitulos);
router.route('/:id').get(getByID).patch(updateTitulo).delete(deleteTitulo);

export default router;
