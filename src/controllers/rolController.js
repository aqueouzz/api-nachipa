// Dependencies
import StatusCodes from 'http-status-codes';
import { validatePaginationParams } from '../utils/validatePagination.js';

// Models
import Rol from '../models/Rol.js';

// 🚀 : Create Rol
export const createRol = async (req, res) => {
  // Instanciar un objeto response con los datos que vienen del body
  const targetRol = new Rol({ ...req.body, createdBy: req.user.id });

  const rol = await targetRol.save();

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Rol creado exitosamente',
    data: rol,
  });
};

// 🚀 : Get Alls Rol
export const getAllRoles = async (req, res) => {
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

  const roles = await Rol.find(query)
    .sort({ name: orderValue })
    .skip(skip)
    .limit(limit);

  const rolCount = await Rol.countDocuments();

  if (rolCount === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      msg: 'No se encontraron roles registrados',
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Roles obtenidos exitosamente',
    count: roles.length,
    data: roles,
    totalPages: Math.ceil(rolCount / limit),
    currentPage: parseInt(page),
  });
};

// 🚀 : Get By ID Rol
export const getRolById = async (req, res) => {
  const rol = await Rol.findById(req.params.id).select(
    '-__v -_id -updatedAt -createdAt'
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Rol obtenido exitosamente',
    data: rol,
  });
};

// 🚀 : Update Rol
export const updateRol = async (req, res) => {
  const rol = await Rol.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user.id },
    {
      new: true,
    }
  );

  // Consultar el documento actualizado con campos limitados
  const rolResponse = await Rol.findById(req.params.id).select(
    '-__v -_id -createdAt -updatedAt -__v -createdAt -updatedAt'
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Rol actualizado exitosamente',
    data: rolResponse,
  });
};

// 🚀 : Delete Rol
export const deleteRol = async (req, res) => {
  await Rol.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Rol eliminado exitosamente',
  });
};
