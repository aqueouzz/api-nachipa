import Business from '../models/Business.js';
import { BadRequestError } from '../error/errorResponse.js';

// Get By ID Business
export const getById = async (req, res) => {
  const { id } = req.params;

  const business = await Business.findById(id).select(
    '-commune -description -city -country -createdAt -updatedAt -_id -__v'
  );

  if (!business) {
    throw new BadRequestError('No se encontro la empresa con esa id');
  }

  res.status(200).json({
    msg: 'Empresa encontrada',
    business,
  });
};

// Get All Business
export const getAllBusiness = async (req, res) => {
  const business = await Business.find({});

  if (business.countDocuments === 0) {
    throw new BadRequestError('No hay empresas registradas');
  }

  res.status(200).json({
    msg: 'Lista de empresas',
    business,
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

// Create a new Business
export const createBusiness = async (req, res, next) => {
  const business = new Business(req.body);

  try {
    await business.save();
  } catch (error) {
    throw new BadRequestError('Error al crear la empresa');
  }
  res.status(200).json({
    msg: 'Empresa creada correctamente',
    business,
  });
};
// Update a new Business
export const updateBusiness = async (req, res) => {
  const { id } = req.params;

  const business = await Business.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!business) {
    throw new BadRequestError('No se encontro la empresa con esa id');
  }

  res.json({
    msg: 'Empresa actualizada correctamente',
    business,
  });
};
// Deleted a Business
export const deleteBusiness = async (req, res) => {
  const { id } = req.params;

  const business = await Business.findByIdAndDelete(id);

  if (!business) {
    throw new BadRequestError('No se encontro la empresa con esa id');
  }

  res.json({
    msg: 'Empresa eliminada correctamente',
  });
};
