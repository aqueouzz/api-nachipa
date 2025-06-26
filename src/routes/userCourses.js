// Importar dependenciass
import { Router } from 'express';

// Importar controladores
import {
  assingCourseToUser,
  getUserCourses,
  updatedUserCourse,
  deleteUserCourse,
} from '../controllers/userCourseController.js';

// Importar modelos
import Course from '../models/Course.js';
import UserCourse from '../models/UserCourse.js';
import User from '../models/User.js';

// Middleware
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
import { validateObjectIdsAndExistence } from '../middlewares/validationsUserMiddleware.js';
import { validateStatus } from '../middlewares/otherValidationInputModelMiddleware.js';

const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Cursos de usuario
 *     description: Asignación y gestión de cursos por usuario
 */

/**
 * @swagger
 * /assign:
 *   post:
 *     summary: Asignar un curso a un usuario
 *     tags: [Cursos de usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *               - courseID
 *               - status
 *             properties:
 *               userID:
 *                 type: string
 *                 example: 60f7c4d5b25c1a3a30d0e7a2
 *               courseID:
 *                 type: string
 *                 example: 60f7c4d5b25c1a3a30d0e7a9
 *               status:
 *                 type: string
 *                 enum: [activo, inactivo, completado]
 *                 example: activo
 *     responses:
 *       201:
 *         description: Curso asignado correctamente al usuario
 */

/**
 * @swagger
 * /assign/{id}:
 *   get:
 *     summary: Obtener los cursos asignados de un usuario
 *     tags: [Cursos de usuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cursos del usuario obtenidos correctamente
 *       404:
 *         description: Usuario no encontrado o sin cursos asignados
 */

/**
 * @swagger
 * /assign/{id}:
 *   patch:
 *     summary: Actualizar el estado de un curso asignado a un usuario
 *     tags: [Cursos de usuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la asignación de curso (userCourse)
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [activo, inactivo, completado]
 *                 example: completado
 *     responses:
 *       200:
 *         description: Asignación actualizada correctamente
 *       404:
 *         description: Asignación no encontrada
 */

/**
 * @swagger
 * /assign/{id}:
 *   delete:
 *     summary: Eliminar una asignación de curso a usuario
 *     tags: [Cursos de usuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la asignación (userCourse)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asignación eliminada correctamente
 *       404:
 *         description: Asignación no encontrada
 */

router
  .route('/assign')
  .all(authenticateToken)
  .post(
    authorizeAction('create_own', 'userCourse'),
    validateObjectIdsAndExistence([
      { field: 'id', model: User, location: 'user' },
      { field: 'userID', model: User, location: 'body' },
      { field: 'courseID', model: Course, location: 'body' },
    ]),
    validateStatus,
    assingCourseToUser
  );

router
  .route('/assign/:id')
  .all(authenticateToken)
  .get(
    authorizeAction('create_own', 'userCourse'),
    validateObjectIdsAndExistence([
      { field: 'id', model: User, location: 'user' },
    ]),
    getUserCourses
  );

router
  .route('/assign/:id')
  .all(authenticateToken)
  .patch(
    authorizeAction('update_own', 'userCourse'),
    validateObjectIdsAndExistence([
      { field: 'id', model: User, location: 'user' },
      { field: 'id', model: UserCourse, location: 'params' },
    ]),
    updatedUserCourse
  );

router
  .route('/assign/:id')
  .all(authenticateToken)
  .delete(
    authorizeAction('delete_own', 'userCourse'),
    validateObjectIdsAndExistence([
      { field: 'id', model: User, location: 'user' },
      { field: 'id', model: UserCourse, location: 'params' },
    ]),
    deleteUserCourse
  );

export default router;
