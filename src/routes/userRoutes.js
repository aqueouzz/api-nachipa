import express from 'express';
const router = express.Router();
import multer from '../middlewares/multerMiddleware.js';

import {
  getAllUsers,
  getById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { validateIdParam } from '../middlewares/validationsUserMiddleware.js';

// Middleware de Authentication
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';

router.route('/').get(authenticateToken, getAllUsers);
router.route('/:id').get(authenticateToken, validateIdParam, getById);
router
  .route('/:id')
  .patch(
    authenticateToken,
    multer.single('photoProfile'),
    validateIdParam,
    updateUser
  );
router.route('/:id').delete(authenticateToken, validateIdParam, deleteUser);

export default router;
