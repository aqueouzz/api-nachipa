// Importar dependenciass
import { Router } from 'express';

// Importar controladores
import {
  createUbication,
  getAllUbication,
  getUbication,
  deleteUbication,
  updateUbication,
} from '../controllers/ubicationController.js';

// Importar modelos
import User from '../models/User.js';
import Business from '../models/Business.js';
import Ubication from '../models/Ubication.js';

// Middleware
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
import { validateObjectIdsAndExistence } from '../middlewares/validationsUserMiddleware.js';

const router = Router();

router
  .route('/')
  .post(
    authenticateToken,
    authorizeAction('create_own', 'ubication'),
    validateObjectIdsAndExistence([
      { field: 'id', model: User, location: 'user' }, // valida que el usuario existe
      { field: 'businessID', model: Business, location: 'user' }, // valida que la empresa existe
    ]),
    createUbication
  )
  .get(
    authenticateToken,
    authorizeAction('read_own', 'ubication'),
    getAllUbication
  );

router
  .route('/:id')
  .all(
    authenticateToken,
    validateObjectIdsAndExistence([
      { field: 'id', model: Ubication, location: 'params' },
    ])
  )
  .get(
    authorizeAction('read_own', 'ubication'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Ubication, location: 'params' },
    ]),
    getUbication
  )
  .delete(
    authorizeAction('delete_own', 'ubication'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Ubication, location: 'params' },
    ]),
    deleteUbication
  )
  .patch(
    authorizeAction('update_own', 'ubication'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Ubication, location: 'params' },
    ]),
    updateUbication
  );

export default router;
