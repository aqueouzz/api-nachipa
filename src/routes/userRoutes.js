// Dependecies
import express from 'express';
const router = express.Router();
import multer from '../middlewares/multerMiddleware.js';

// Importar modelos
import User from '../models/User.js';
import Business from '../models/Business.js';
import Ubication from '../models/Ubication.js';
import Rol from '../models/Rol.js';
import Area from '../models/Area.js';
import Titulo from '../models/Titulo.js';

import {
  getAllUsers,
  getById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

// Middleware
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
import { validateObjectIdsAndExistence } from '../middlewares/validationsUserMiddleware.js';

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Obtener todos los usuarios
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 */
router
  .route('/')
  .all(authenticateToken)
  .get(authorizeAction('read_own', 'user'), getAllUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */
router.route('/:id').get(
  validateObjectIdsAndExistence([
    { field: 'id', model: User, location: 'body' },
    { field: 'businessID', model: Business, location: 'params' },
  ]),
  authorizeAction('read_own', 'user'),
  getById
);
/**
 * @swagger
 * /user:
 *   patch:
 *     summary: Actualiza un usuario existente
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               businessID:
 *                 type: string
 *               ubicationID:
 *                 type: string
 *               rolID:
 *                 type: string
 *               photoProfile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 */
// routes/userRoute.js (o donde tengas el PATCH de updateUser)
router
  .route('/')
  .all(authenticateToken)
  .patch(
    multer.single('photoProfile'),
    validateObjectIdsAndExistence([
      { field: 'id', model: User, location: 'body', required: true },
      // 👇 solo obligatorios si NO es superadmin
      {
        field: 'businessID',
        model: Business,
        location: 'body',
        required: (req) => !req.user.isSuperadmin,
      },
      {
        field: 'ubicationID',
        model: Ubication,
        location: 'body',
        required: (req) => !req.user.isSuperadmin,
      },
      {
        field: 'rolID',
        model: Rol,
        location: 'body',
        required: (req) => !req.user.isSuperadmin,
      },
      // Si manejas área/título, idem:
      // { field: 'areaID', model: Area, location: 'body', required: (req) => !req.user.isSuperadmin },
      // { field: 'professionalDegreeID', model: Degree, location: 'body', required: (req) => !req.user.isSuperadmin },
    ]),
    updateUser
  );

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 */
router
  .route('/:id')
  .delete(
    authenticateToken,
    validateObjectIdsAndExistence([
      { field: 'id', model: User, location: 'params' },
    ]),
    authorizeAction('delete', 'user'),
    deleteUser
  );

export default router;
