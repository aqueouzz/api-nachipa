// Dependencies
import { StatusCodes } from 'http-status-codes';
import { validatePaginationParams } from '../utils/validatePagination.js';

// Models
import Business from '../models/Business.js';

// Errors
import { BadRequestError } from '../error/errorResponse.js';

// 🚀 : Create a new Business
export const createBusiness = async (req, res, next) => {
  // ✅ : Se Validar que solo el superadmin pueda crear usuarios con Middleware

  const business = new Business({ ...req.body, createdBy: req.user.id });

  await business.save();

  res.status(StatusCodes.CREATED).json({
    msg: 'Empresa creada correctamente',
    data: business,
  });
};

// 🚀 : Get By ID Business
export const getById = async (req, res) => {
  const { id } = req.params;

  const business = await Business.findById(id).select(
    '-commune -description -city -country -createdAt -updatedAt -__v'
  );

  if (!business) {
    throw new BadRequestError('No se encontro la empresa con esa id');
  }

  if (req.user.businessID !== business._id.toString()) {
    throw new BadRequestError('No tienes permiso para ver esta empresa');
  }

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Empresa encontrada',
    data: business,
  });
};

// 🚀 : Get All Business
export const getAllBusiness = async (req, res) => {
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

  const business = await Business.find(query)
    .sort({ name: orderValue })
    .skip(skip)
    .limit(limit);

  if (business.countDocuments === 0) {
    throw new BadRequestError('No hay empresas registradas');
  }

  const totalBusiness = await Business.countDocuments(query);

  if (req.user.role === 'superadmin') {
    // const businessAll = await Business.find();
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: 'Lista de empresas',
      count: business.length,
      data: business,
      total: totalBusiness,
      totalPages: Math.ceil(totalBusiness / limit),
      currentPage: parseInt(page),
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Lista de empresas',
  });
};

// 🚀 : Update a new Business
export const updateBusiness = async (req, res) => {
  const userRole = req.user.role;
  const business = await Business.findById(req.params.id);

  if (!business) {
    throw new BadRequestError('No se encontro la empresa con esa id');
  }

  const businessNew = await Business.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user.id },
    {
      runValidators: false,
      new: true,
    }
  );

  res.json({
    success: true,
    msg: 'Empresa actualizada correctamente',
    data: businessNew,
  });
};

// 🚀 : Deleted a Business
export const deleteBusiness = async (req, res) => {
  const { id } = req.params;

  const business = await Business.findByIdAndDelete(id, {
    state: false,
    deletedBy: req.user.id,
    deletedAt: new Date(),
  });

  if (!business) {
    throw new BadRequestError('No se encontro la empresa con esa id');
  }

  res.json({
    msg: 'Empresa eliminada correctamente',
  });
};
