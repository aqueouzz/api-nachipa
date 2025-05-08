import Course from '../models/Course.js';
import StatusCodes from 'http-status-codes';

// Create a new course
export const createCourse = async (req, res) => {
  const course = await Course.create(req.body);

  const response = await Course.findById(course._id).select(
    'name description dictoCourse -_id'
  );

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: 'Curso creado correctamente',
    data: response,
  });
};

// Get All Courses
export const getAllCourses = async (req, res) => {
  const courses = await Course.find().select(
    'courseID name  description dictoCourse -_id'
  );

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Cursos encontrados correctamente',
    data: courses,
  });
};

// Get By ID Course
export const getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).select(
    'courseID name description dictoCourse -_id'
  );

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Curso encontrado correctamente',
    data: course,
  });
};

// Update  Course
export const updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Curso actualizado correctamente',
    data: course,
  });
};

// Delete  Course
export const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Curso eliminado correctamente',
  });
};
