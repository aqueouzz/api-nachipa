import Business from '../models/Business.js';
import { BadRequestError } from '../error/errorResponse.js';

export const getById = async (req, res) => {};

export const getAllBusiness = async (req, res) => {};

// Create a new Business
export const createBusiness = async (req, res) => {
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

export const updateBusiness = async (req, res) => {};
export const deleteBusiness = async (req, res) => {};
