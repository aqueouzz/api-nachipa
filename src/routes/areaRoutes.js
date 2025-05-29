// Importing necessary modules
import { Router } from 'express';

// Controllers
import {
  getAllAreas,
  createArea,
  getAreaById,
  updateArea,
  deleteArea,
} from '../controllers/areaController.js';

// Importar modelos

import Area from '../models/Area.js';

// Middleware de Authentication
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
import { validateObjectIdsAndExistence } from '../middlewares/validationsUserMiddleware.js';

// Create a new router instance
const router = Router();

router
  .route('/')
  .all(authenticateToken)
  .get(authorizeAction('read_own', 'area'), getAllAreas)
  .post(authorizeAction('create_own', 'area'), createArea);

router
  .route('/:id')
  .all(authenticateToken)
  .get(
    authorizeAction('update_own', 'area'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Area, location: 'params' },
    ]),
    getAreaById
  )
  .patch(
    authorizeAction('update_own', 'area'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Area, location: 'params' },
    ]),
    updateArea
  )
  .delete(
    authorizeAction('update_own', 'area'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Area, location: 'params' },
    ]),
    deleteArea
  );

export default router;
