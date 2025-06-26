// Dependencies
import StatusCodes from 'http-status-codes';
import { validatePaginationParams } from '../utils/validatePagination.js';

// Models
import Course from '../models/Course.js';

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
  const { q, order, status, startDate, endDate } = req.query;

  const { page, limit, skip } = validatePaginationParams(req.query);

  // Construir query base
  const query = {};

  // Si hay búsqueda, armar condiciones para nombre o apellido
  if (q && q.trim() !== '') {
    const tokens = q.trim().split(/\s+/);
    const conditions = tokens.map((token) => {
      const regex = new RegExp(token, 'i');
      return {
        $or: [{ name: regex }],
      };
    });
    query.$and = conditions;
  }

  // 🔍 Filtro por estado activo/inactivo
  if (status === 'activo') {
    query.state = true;
  } else if (status === 'inactivo') {
    query.state = false;
  }

  // 🔍 Filtro por fechas (createdAt)
  if (startDate || endDate) {
    query.createdAt = {};

    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Fin del día
      query.createdAt.$lte = end;
    }
  }

  // Determinar orden (ascendente por defecto)
  const orderValue = order?.toLowerCase() === 'desc' ? -1 : 1;

  const courses = await Course.find(query)
    .sort({ name: orderValue })
    .skip(skip)
    .limit(limit)
    .select('courseID name description dictoCourse -_id');

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
    total: courseCount,
    totalPages: Math.ceil(courseCount / limit),
    currentPage: parseInt(page),
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
