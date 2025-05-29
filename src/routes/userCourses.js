// Importar dependenciass
import { Router } from 'express';

// Importar controladores
import {
  assingCourseToUser,
  getUserCourses,
} from '../controllers/userCourseController.js';

// Importar modelos
import Course from '../models/Course.js';
import User from '../models/User.js';

// Middleware
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
import { validateObjectIdsAndExistence } from '../middlewares/validationsUserMiddleware.js';

const router = Router();

router
  .route('/')
  .all(authenticateToken)
  .get(
    authorizeAction('create_own', 'userCourse'),
    validateObjectIdsAndExistence([
      { field: 'id', model: User, location: 'user' },
    ]),
    getUserCourses
  )
  .post(
    authorizeAction('create_own', 'userCourse'),
    validateObjectIdsAndExistence([
      { field: 'id', model: User, location: 'user' },
      { field: 'userID', model: User, location: 'body' },
      { field: 'courseID', model: Course, location: 'body' },
    ]),
    assingCourseToUser
  );

export default router;
