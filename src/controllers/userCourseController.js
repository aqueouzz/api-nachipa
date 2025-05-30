// Dependencies
import { StatusCodes } from 'http-status-codes';

// Models
import UserCourse from '../models/UserCourse.js';

// 🚀 : Asignar cursos a usario
export const assingCourseToUser = async (req, res) => {
  // Validacion si el curso existe se hace en el router con el middleware validateObjectIdsAndExistence
  // Validacion si el usuario existe se hace en el router con el middleware validateObjectIdsAndExistence
  const { userID, courseID } = req.body;

  if (
    req.body.expirationDate &&
    new Date(req.body.expirationDate) < new Date()
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: 'La fecha de expiración debe ser posterior a hoy.',
    });
  }
  if (
    req.body.boardingCardValidUntil &&
    new Date(req.body.boardingCardValidUntil) < new Date()
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: 'La fecha de expiración debe ser posterior a hoy.',
    });
  }

  // 1.- Validar que el usuario que asigna el curso tenga permisos
  const newAssignment = await UserCourse.findOneAndUpdate(
    { userID, courseID },
    {
      $set: {
        ...req.body,
        createdBY: req.user.id,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  ).select('status -_id');

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: 'Curso asignado correctamente',
    data: newAssignment,
  });
};

// 🚀 : Obtener los cursos de un usuario
export const getUserCourses = async (req, res) => {
  const { id } = req.params;

  const userCourses = await UserCourse.find({ userID: id })
    .populate({
      path: 'courseID',
      // match : { status: 'Completado' },
      select: 'name description dictoCourse',
      options: {
        limit: 5,
      },
    })
    .select('-createdAt -updatedAt -createdBy -__v -status');

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Cursos obtenidos correctamente',
    count: userCourses.length,
    data: userCourses,
  });
};

// 🚀 : Updatear un curso de un usuario
export const updatedUserCourse = async (req, res) => {
  const { id } = req.params;

  if (
    req.body.expirationDate &&
    new Date(req.body.expirationDate) < new Date()
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: 'La fecha de expiración debe ser posterior a hoy.',
    });
  }
  if (
    req.body.boardingCardValidUntil &&
    new Date(req.body.boardingCardValidUntil) < new Date()
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: 'La fecha de expiración debe ser posterior a hoy.',
    });
  }

  const updated = await UserCourse.findByIdAndUpdate(
    id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updated)
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      msg: 'Curso no encontrado',
    });

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Curso actualizado correctamente',
    data: updated,
  });
};

// 🚀 : Deleted un curso de un usuario
export const deleteUserCourse = async (req, res) => {
  const { id } = req.params;

  await UserCourse.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Curso eliminado correctamente',
  });
};
