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

/**
 * @swagger
 * /business:
 *   get:
 *     summary: Obtener todas las empresas
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas obtenida exitosamente
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /business:
 *   post:
 *     summary: Crear una nueva empresa
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Empresa XYZ
 *               address:
 *                 type: string
 *                 example: Calle 123, Ciudad
 *               phone:
 *                 type: string
 *                 example: +123456789
 *               email:
 *                 type: string
 *                 example: contacto@empresa.com
 *     responses:
 *       201:
 *         description: Empresa creada exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /business/{id}:
 *   get:
 *     summary: Obtener una empresa por ID
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la empresa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *       404:
 *         description: Empresa no encontrada
 */

/**
 * @swagger
 * /business/{id}:
 *   patch:
 *     summary: Actualizar una empresa
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la empresa
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Empresa actualizada correctamente
 *       404:
 *         description: Empresa no encontrada
 */

/**
 * @swagger
 * /business/{id}:
 *   delete:
 *     summary: Eliminar una empresa
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la empresa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Empresa eliminada exitosamente
 *       404:
 *         description: Empresa no encontrada
 */

// 📈 :
router.get(
  '/',
  authenticateToken,
  authorizeAction('read', 'business'),
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
