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
/**
 * @swagger
 * tags:
 *   - name: Roles
 *     description: Endpoints para gestionar roles de usuario
 */

/**
 * @swagger
 * /rol:
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Administrador
 *               description:
 *                 type: string
 *                 example: Tiene acceso completo al sistema
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 */

/**
 * @swagger
 * /rol:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles obtenida correctamente
 */

/**
 * @swagger
 * /rol/{id}:
 *   get:
 *     summary: Obtener un rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol encontrado
 *       404:
 *         description: Rol no encontrado
 */

/**
 * @swagger
 * /rol/{id}:
 *   patch:
 *     summary: Actualizar un rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *       404:
 *         description: Rol no encontrado
 */

/**
 * @swagger
 * /rol/{id}:
 *   delete:
 *     summary: Eliminar un rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *       404:
 *         description: Rol no encontrado
 */

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
