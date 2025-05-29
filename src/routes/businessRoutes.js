import { Router } from 'express';

// Importar modelos
import User from '../models/User.js';
import Business from '../models/Business.js';

// Importar controladores
import {
  createBusiness,
  getAllBusiness,
  getById,
  updateBusiness,
  deleteBusiness,
} from '../controllers/businessController.js';
import { validateRegisterBusinessInput } from '../middlewares/validationRegisterUserMiddleware.js';
import { validateIdParam } from '../middlewares/validateIdParams.js';

// Middleware de Authentication
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { validateObjectIdsAndExistence } from '../middlewares/validationsUserMiddleware.js';

const router = Router();

// 📈 :
router.get(
  '/',
  authenticateToken,
  authorizeAction('read_own', 'business'),
  getAllBusiness
);

router.post(
  '/',
  authenticateToken,
  authorizeAction('create', 'business'),
  createBusiness
);

router.get(
  '/:id',
  authenticateToken,
  authorizeAction('read_own', 'business'),
  validateObjectIdsAndExistence([
    { field: 'businessID', model: User, location: 'user' },
  ]),
  getById
);

router.patch(
  '/:id',
  authenticateToken,
  authorizeAction('update', 'business'),
  validateObjectIdsAndExistence([
    // { field: 'businessID', model: User, location: 'user' },
    { field: 'id', model: Business, location: 'params' },
  ]),
  updateBusiness
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeAction('delete', 'business'),
  validateObjectIdsAndExistence([
    { field: 'id', model: Business, location: 'params' },
  ]),
  deleteBusiness
);

export default router;
