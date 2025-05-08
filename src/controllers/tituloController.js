import Titulo from '../models/Titulo.js';
import StatusCodes from 'http-status-codes';

// Create a new Titulo
export const createTitulo = async (req, res) => {
  const titulo = await Titulo.create(req.body);

  const response = {
    institution: titulo.institution,
    name: titulo.name,
    description: titulo.description,
  };

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: 'Titulo creado correctamente',
    data: response,
  });
};

// Get All Titulos
export const getAllTitulos = async (req, res) => {
  const titulos = await Titulo.find().select(
    '-__v -_id -createdAt -updatedAt -__v -createdAt -updatedAt'
  );

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Titulos obtenidos correctamente',
    data: titulos,
  });
};

// Get By ID Titulo
export const getByID = async (req, res) => {
  const titulo = await Titulo.findById(req.params.id).select(
    '-__v -_id -createdAt -updatedAt -__v -createdAt -updatedAt'
  );

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Titulo obtenido correctamente',
    data: titulo,
  });
};

// Update Titulo
export const updateTitulo = async (req, res) => {
  await Titulo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // Consultar el documento actualizado con campos limitados
  const tituloResponse = await Titulo.findById(req.params.id).select(
    '-__v -_id -createdAt -updatedAt -__v -createdAt -updatedAt'
  );

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Titulo actualizado correctamente',
    data: tituloResponse,
  });
};

// Delete Titulo
export const deleteTitulo = async (req, res) => {
  await Titulo.findByIdAndDelete(req.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Titulo eliminado correctamente',
  });
};
