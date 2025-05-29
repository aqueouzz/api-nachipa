import Business from '../models/Business.js';
import { BadRequestError } from '../error/errorResponse.js';
import { StatusCodes } from 'http-status-codes';

// 🚀 : Create a new Business
export const createBusiness = async (req, res, next) => {
  // ✅ : Se Validar que solo el superadmin pueda crear usuarios con Middleware

  const business = new Business({ ...req.body, createdBy: req.user.id });

  await business.save();

  res.status(200).json({
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

  res.status(200).json({
    success: true,
    msg: 'Empresa encontrada',
    data: business,
  });
};

// 🚀 : Get All Business
export const getAllBusiness = async (req, res) => {
  const business = await Business.find({ _id: req.user.businessID });

  if (business.countDocuments === 0) {
    throw new BadRequestError('No hay empresas registradas');
  }

  if (req.user.role === 'superadmin') {
    const businessAll = await Business.find();
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: 'Lista de empresas',
      data: businessAll,
      count: businessAll.length,
    });
  }

  res.status(200).json({
    success: true,
    msg: 'Lista de empresas',
    count: business.length,
    data: business,
    // total,
    // page,
    // limit,
    // 'msg: 'Lista de empresas
  });

  // const { page = 1, limit = 10 } = req.query;
  // const skip = (page - 1) * limit;
  // const total = await Business.countDocuments({});
  // const business = await Business.find({}).skip(skip).limit(limit);
  // res.status(200).json({
  //     msg: 'Lista de empresas',
  //     total,
  //     page,
  //     limit,
  //     business,
  // });
};

// 🚀 : Update a new Business
export const updateBusiness = async (req, res) => {
  // if (req.user.businessID !== id.toString()) {
  //   throw new BadRequestError('No tienes permiso para ver esta empresa');
  // }
  const userRole = req.user.role;
  const business = await Business.findById(req.params.id);

  if (!business) {
    throw new BadRequestError('No se encontro la empresa con esa id');
  }

  // // Validar acceso
  // if (userRole !== 'superadmin' && userBusinessID !== targetBusinessID) {
  //   throw new BadRequestError('No tienes permiso para modificar esta empresa');
  // }

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
