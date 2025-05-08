import Rol from '../models/Rol.js';
import StatusCodes from 'http-status-codes';
import { BadRequestError } from '../error/errorResponse.js';

// Create Rol
export const createRol = async (req, res) => {
  const rol = await Rol.create(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Rol creado exitosamente',
    data: rol,
  });
};

// Get Alls Rol
export const getAllRoles = async (req, res) => {
  const roles = await Rol.find();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Roles obtenidos exitosamente',
    data: roles,
  });
};

// Get By ID Rol
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

// Update Rol
export const updateRol = async (req, res) => {
  const rol = await Rol.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Rol actualizado exitosamente',
    data: rol,
  });
};

// Delete Rol
export const deleteRol = async (req, res) => {
  await Rol.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Rol eliminado exitosamente',
  });
};
