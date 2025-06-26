// Dependecies
import express from 'express';
const router = express.Router();
import multer from '../middlewares/multerMiddleware.js';

// Importar modelos
import User from '../models/User.js';
import Business from '../models/Business.js';
import Ubication from '../models/Ubication.js';
import Rol from '../models/Rol.js';

import {
  getAllUsers,
  getById,
  updateUser,
  deleteUser,
  getUserByLimit,
} from '../controllers/userController.js';

// Middleware
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
import { validateObjectIdsAndExistence } from '../middlewares/validationsUserMiddleware.js';

router
  .route('/')
  .all(authenticateToken)
  .get(authorizeAction('read_own', 'user'), getAllUsers)
  .get(authorizeAction('read_own', 'user'), getUserByLimit);

router
  .route('/by-limit')
  .all(authenticateToken)
  .get(authorizeAction('read_own', 'user'), getUserByLimit);

router.route('/:id').get(
  validateObjectIdsAndExistence([
    { field: 'id', model: User, location: 'body' },
    { field: 'businessID', model: Business, location: 'body' },
  ]),
  authorizeAction('read_own', 'user'),
  getById
);

router
  .route('/')
  .all(authenticateToken)
  .patch(
    multer.single('photoProfile'),
    validateObjectIdsAndExistence([
      { field: 'id', model: User, location: 'body' },
      { field: 'businessID', model: Business, location: 'body' },
      { field: 'ubicationID', model: Ubication, location: 'body' },
      { field: 'rolID', model: Rol, location: 'body' },
    ]),
    updateUser
  );

router
  .route('/:id')
  .delete(
    authenticateToken,
    validateObjectIdsAndExistence([
      { field: 'id', model: User, location: 'body' },
    ]),
    authorizeAction('delete', 'user'),
    deleteUser
  );

export default router;
