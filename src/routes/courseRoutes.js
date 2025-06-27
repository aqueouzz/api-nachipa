// Importar dependenciass
import { Router } from 'express';

// Importar controladores
import {
  createCourse,
  getAllCourses,
  updateCourse,
  getCourse,
  deleteCourse,
} from '../controllers/courseController.js';

// Importar modelos
import Course from '../models/Course.js';

// Middleware
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
import { validateObjectIdsAndExistence } from '../middlewares/validationsUserMiddleware.js';

const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Cursos
 *     description: Endpoints para gestionar cursos
 */

/**
 * @swagger
 * /course:
 *   post:
 *     summary: Crear un nuevo curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               courseID:
 *                 type: string
 *                 example: 232546787b
 *               name:
 *                 type: string
 *                 example: Curso OMI
 *               description:
 *                 type: string
 *                 example: se creo en enero
 *               dictoCourse:
 *                 type: string
 *                 example: Marinos
 *               state:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 */

/**
 * @swagger
 * /course:
 *   get:
 *     summary: Obtener todos los cursos
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos obtenida correctamente
 */

/**
 * @swagger
 * /course/{id}:
 *   get:
 *     summary: Obtener un curso por ID
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso encontrado
 *       404:
 *         description: Curso no encontrado
 */

/**
 * @swagger
 * /course/{id}:
 *   patch:
 *     summary: Actualizar un curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               level:
 *                 type: string
 *     responses:
 *       200:
 *         description: Curso actualizado correctamente
 *       404:
 *         description: Curso no encontrado
 */

/**
 * @swagger
 * /course/{id}:
 *   delete:
 *     summary: Eliminar un curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso eliminado exitosamente
 *       404:
 *         description: Curso no encontrado
 */

router
  .route('/')
  .all(authenticateToken)
  .post(authorizeAction('create', 'course'), createCourse)
  .get(authorizeAction('read', 'course'), getAllCourses);

router
  .route('/:id')
  .all(authenticateToken)
  .get(
    authorizeAction('read', 'course'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Course, location: 'params' },
    ]),
    getCourse
  )
  .patch(
    authorizeAction('update', 'course'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Course, location: 'params' },
    ]),
    updateCourse
  )
  .delete(
    authorizeAction('delete', 'course'),
    validateObjectIdsAndExistence([
      { field: 'id', model: Course, location: 'params' },
    ]),
    deleteCourse
  );

export default router;
