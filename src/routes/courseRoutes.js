import { Router } from 'express';
import {
  createCourse,
  getAllCourses,
  updateCourse,
  getCourse,
  deleteCourse,
} from '../controllers/courseController.js';

const router = Router();

router.route('/').post(createCourse).get(getAllCourses);
router.route('/:id').get(getCourse).patch(updateCourse).delete(deleteCourse);

export default router;
