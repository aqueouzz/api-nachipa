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
/**
 * @swagger
 * tags:
 *   - name: Ubicaciones
 *     description: Endpoints para gestionar ubicaciones físicas asociadas a usuarios o empresas
 */

/**
 * @swagger
 * /ubication:
 *   post:
 *     summary: Crear una nueva ubicación
 *     tags: [Ubicaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               direccion:
 *                 type: string
 *                 example: Calle Falsa 123
 *               ciudad:
 *                 type: string
 *                 example: Lima
 *               departamento:
 *                 type: string
 *                 example: Lima Metropolitana
 *               pais:
 *                 type: string
 *                 example: Perú
 *     responses:
 *       201:
 *         description: Ubicación creada exitosamente
 */

/**
 * @swagger
 * /ubication:
 *   get:
 *     summary: Obtener todas las ubicaciones del usuario autenticado
 *     tags: [Ubicaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ubicaciones obtenida correctamente
 */

/**
 * @swagger
 * /ubication/{id}:
 *   get:
 *     summary: Obtener una ubicación por ID
 *     tags: [Ubicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la ubicación
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ubicación encontrada
 *       404:
 *         description: Ubicación no encontrada
 */

/**
 * @swagger
 * /ubication/{id}:
 *   patch:
 *     summary: Actualizar una ubicación por ID
 *     tags: [Ubicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la ubicación a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               direccion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               departamento:
 *                 type: string
 *               pais:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ubicación actualizada correctamente
 *       404:
 *         description: Ubicación no encontrada
 */

/**
 * @swagger
 * /ubication/{id}:
 *   delete:
 *     summary: Eliminar una ubicación por ID
 *     tags: [Ubicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la ubicación a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ubicación eliminada exitosamente
 *       404:
 *         description: Ubicación no encontrada
 */

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
