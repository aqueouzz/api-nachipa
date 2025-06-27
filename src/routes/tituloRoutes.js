// Importar dependenciass
import { Router } from 'express';

// Importar controladores
import {
  createTitulo,
  getAllTitulos,
  getByID,
  updateTitulo,
  deleteTitulo,
} from '../controllers/tituloController.js';

// Importar modelos
import Titulo from '../models/Titulo.js';

// Middleware
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
import { validateObjectIdsAndExistence } from '../middlewares/validationsUserMiddleware.js';

const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Títulos
 *     description: Endpoints para gestionar títulos académicos u ocupacionales
 */

/**
 * @swagger
 * /titulo:
 *   post:
 *     summary: Crear un nuevo título
 *     tags: [Títulos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *                 example: Universidad Nacional de chile
 *               name:
 *                 type: string
 *                 example: Ingeniero de Software
 *               description:
 *                 type: string
 *                 example: se realizo 2020-12-10
 *               state:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Título creado exitosamente
 */

/**
 * @swagger
 * /titulo:
 *   get:
 *     summary: Obtener todos los títulos
 *     tags: [Títulos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de títulos obtenida correctamente
 */

/**
 * @swagger
 * /titulo/{id}:
 *   get:
 *     summary: Obtener un título por ID
 *     tags: [Títulos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del título
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Título encontrado
 *       404:
 *         description: Título no encontrado
 */

/**
 * @swagger
 * /titulo/{id}:
 *   patch:
 *     summary: Actualizar un título por ID
 *     tags: [Títulos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del título a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               institucion:
 *                 type: string
 *               fechaEmision:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Título actualizado correctamente
 *       404:
 *         description: Título no encontrado
 */

/**
 * @swagger
 * /titulo/{id}:
 *   delete:
 *     summary: Eliminar un título por ID
 *     tags: [Títulos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del título a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Título eliminado exitosamente
 *       404:
 *         description: Título no encontrado
 */

router
  .route('/')
  .all(authenticateToken)
  .post(createTitulo)
  .get(authorizeAction('read', 'titulo'), getAllTitulos);

router
  .route('/:id')
  .all(authenticateToken)
  .get(
    authorizeAction('read', 'titulo'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Titulo, location: 'params' },
    ]),
    getByID
  )
  .patch(
    authorizeAction('update', 'titulo'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Titulo, location: 'params' },
    ]),
    updateTitulo
  )
  .delete(
    authorizeAction('delete', 'titulo'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Titulo, location: 'params' },
    ]),
    deleteTitulo
  );

export default router;
