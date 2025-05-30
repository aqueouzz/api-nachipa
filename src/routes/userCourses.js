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
