import Course from '../models/Course.js';
import StatusCodes from 'http-status-codes';

// 🚀 Create a new course
export const createCourse = async (req, res) => {
  // Instanciar un objeto req con los datos que vienen del body
  const course = new Course({ ...req.body, createdBy: req.user.id });

  const createCourse = await course.save();

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: 'Curso creado correctamente',
    data: createCourse,
  });
};

// 🚀 Get All Courses
export const getAllCourses = async (req, res) => {
  const courses = await Course.find().select(
    'courseID name description dictoCourse -_id'
  );

  const courseCount = await Course.countDocuments();

  if (courseCount === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      msg: 'No se encontraron cursos registrados',
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Cursos encontrados correctamente',
    count: courses.length,
    data: courses,
  });
};

// 🚀 Get By ID Course
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

// 🚀 Update  Course
export const updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user.id },
    {
      new: true,
      runValidators: true,
    }
  );

  // Consultar el documento actualizado con campos limitados
  const courseResponse = await Course.findById(req.params.id).select(
    '-__v -_id -createdAt -updatedAt -__v -createdAt -updatedAt'
  );

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Curso actualizado correctamente',
    data: courseResponse,
  });
};

// 🚀 Delete  Course
export const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Curso eliminado correctamente',
  });
};
