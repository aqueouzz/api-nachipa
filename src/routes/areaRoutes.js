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
/**
 * @swagger
 * /area:
 *   get:
 *     summary: Obtener todas las áreas
 *     tags:
 *       - Áreas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de áreas obtenida correctamente
 */

/**
 * @swagger
 * /area:
 *   post:
 *     summary: Crear una nueva área
 *     tags:
 *       - Áreas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ubicationID:
 *                  type : string
 *                  example : Ronia polaris
 *                  required: true
 *               name:
 *                 type: string
 *                 example: Sala de maquinas
 *               description:
 *                 type: string
 *                 example: personal
 *               state:
 *                  type: boolean
 *                  example: true
 *               createdBy:
 *                  type: string
 *     responses:
 *       201:
 *         description: Área creada exitosamente
 */

/**
 * @swagger
 * /area/{id}:
 *   get:
 *     summary: Obtener un área por ID
 *     tags:
 *       - Áreas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del área
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Área encontrada exitosamente
 *       404:
 *         description: Área no encontrada
 */

/**
 * @swagger
 * /area/{id}:
 *   patch:
 *     summary: Actualizar un área por ID
 *     tags:
 *       - Áreas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del área
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Área actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Área no encontrada
 */

/**
 * @swagger
 * /area/{id}:
 *   delete:
 *     summary: Eliminar un área por ID
 *     tags:
 *       - Áreas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del área
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Área eliminada correctamente
 *       404:
 *         description: Área no encontrada
 */

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
