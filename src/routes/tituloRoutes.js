// Importar dependenciass
import { Router } from 'express';

// Importar controladores
import {
  createTitulo,
  getAllTitulos,
  getByID,
  updateTitulo,
  deleteTitulo,
} from '../controllers/tituloController.js';

// Importar modelos
import Titulo from '../models/Titulo.js';

// Middleware
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
import { validateObjectIdsAndExistence } from '../middlewares/validationsUserMiddleware.js';

const router = Router();

router
  .route('/')
  .all(authenticateToken)
  .post(createTitulo)
  .get(authorizeAction('read', 'titulo'), getAllTitulos);

router
  .route('/:id')
  .all(authenticateToken)
  .get(
    authorizeAction('read', 'titulo'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Titulo, location: 'params' },
    ]),
    getByID
  )
  .patch(
    authorizeAction('update', 'titulo'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Titulo, location: 'params' },
    ]),
    updateTitulo
  )
  .delete(
    authorizeAction('delete', 'titulo'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Titulo, location: 'params' },
    ]),
    deleteTitulo
  );

export default router;
