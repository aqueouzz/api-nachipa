import { StatusCodes } from 'http-status-codes';

// Models
import UserCourse from '../models/UserCourse.js';

// 🚀 : Asignar cursos a usario
export const assingCourseToUser = async (req, res) => {
  // Validacion si el curso existe se hace en el router con el middleware validateObjectIdsAndExistence
  // Validacion si el usuario existe se hace en el router con el middleware validateObjectIdsAndExistence
  const { userID, courseID } = req.body;
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
export const getUserCourses = async (req, res) => {};
