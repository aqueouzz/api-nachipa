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
