// Dependencies
import { StatusCodes } from 'http-status-codes';
import { validatePaginationParams } from '../utils/validatePagination.js';
import mongoose from 'mongoose';

// Models
import UserCourse from '../models/UserCourse.js';

// Errors
import { BadRequestError } from '../error/errorResponse.js';

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
  const { q, order, status, startDate, endDate } = req.query;
  const { page, limit, skip } = validatePaginationParams(req.query);

  const { id } = req.params;
  const userId = new mongoose.Types.ObjectId(id);

  // Determinar orden (ascendente por defecto)
  const orderValue = order?.toLowerCase() === 'desc' ? -1 : 1;

  const pipeline = [
    // Etapas iniciales (igual que antes)
    { $match: { userID: userId } },
    {
      $lookup: {
        from: 'courses',
        localField: 'courseID',
        foreignField: '_id',
        as: 'courseDetails',
      },
    },
    { $unwind: '$courseDetails' },

    ...(q
      ? [
          {
            $match: {
              'courseDetails.name': { $regex: q, $options: 'i' },
            },
          },
        ]
      : []),

    { $sort: { 'courseDetails.name': orderValue } },

    // Etapa $facet modificada
    {
      $facet: {
        paginatedResults: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              courseID: '$courseDetails._id',
              name: '$courseDetails.name',
              description: '$courseDetails.description',
              dictoCourse: '$courseDetails.dictoCourse',
            },
          },
        ],
        totalCount: [{ $count: 'total' }],
      },
    },

    // Nuevas etapas para transformar el resultado
    { $unwind: '$totalCount' },
    {
      $project: {
        msg: 'Cursos asignados a usuario',
        data: '$paginatedResults',
        total: '$totalCount.total',
        currentPage: { $literal: parseInt(page) },
        totalPages: {
          $ceil: {
            $divide: ['$totalCount.total', limit],
          },
        },
      },
    },
  ];

  // Ejecutar la consulta
  const [result] = await UserCourse.aggregate(pipeline);

  res.status(StatusCodes.OK).json(
    result || {
      data: [],
      total: 0,
      page: parseInt(page),
      totalPages: 0,
    }
  );
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
