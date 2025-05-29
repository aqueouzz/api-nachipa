// Importar dependenciass
import { Router } from 'express';

// Importar controladores
import {
  createRol,
  getAllRoles,
  getRolById,
  updateRol,
  deleteRol,
} from '../controllers/rolController.js';

// Importar modelos
import Rol from '../models/Rol.js';

// Middleware
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
import { validateObjectIdsAndExistence } from '../middlewares/validationsUserMiddleware.js';

const router = Router();

router
  .route('/')
  .all(authenticateToken)
  .post(authorizeAction('create', 'rol'), createRol)
  .get(authorizeAction('read', 'rol'), getAllRoles);

router
  .route('/:id')
  .all(authenticateToken)
  .get(
    authorizeAction('read', 'rol'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Rol, location: 'params' },
    ]),
    getRolById
  )
  .patch(
    authorizeAction('update', 'rol'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Rol, location: 'params' },
    ]),
    updateRol
  )
  .delete(
    authorizeAction('delete', 'rol'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Rol, location: 'params' },
    ]),
    deleteRol
  );

export default router;
