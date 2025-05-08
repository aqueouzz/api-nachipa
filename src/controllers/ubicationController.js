import Ubication from '../models/Ubication.js';
import StatusCodes from 'http-status-codes';
import { BadRequestError } from '../error/errorResponse.js';

// Create a new Ubication
export const createUbication = async (req, res) => {
  const business = await Ubication.create(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: 'Ubicationes creada',
    data: business,
  });
};

// Get All Ubication
export const getAllUbication = async (req, res) => {
  const ubication = await Ubication.find();

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Ubicationes encontradas',
    data: ubication,
  });
};

// Get getBYID
export const getUbication = async (req, res) => {
  const { id } = req.params;
  const ubication = await Ubication.findById(id);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Ubication encontrada',
    data: ubication,
  });
};

// Updated Ubication
export const updateUbication = async (req, res) => {
  const { id } = req.params;

  const ubication = await Ubication.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Ubication actualizada',
    data: ubication,
  });
};

// Delete a new Ubication
export const deleteUbication = async (req, res) => {
  const { id } = req.params;

  await Ubication.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Ubication eliminada',
  });
};
