import { Router } from 'express';
import {
  createCourse,
  getAllCourses,
  updateCourse,
  getCourse,
  deleteCourse,
} from '../controllers/courseController.js';

// Middleware de Authentication
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';

const router = Router();

router
  .route('/')
  .post(authenticateToken, createCourse)
  .get(authenticateToken, getAllCourses);
router
  .route('/:id')
  .get(authenticateToken, getCourse)
  .patch(authenticateToken, updateCourse)
  .delete(authenticateToken, deleteCourse);

export default router;
