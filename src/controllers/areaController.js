import Area from '../models/Area.js';
import StatusCodes from 'http-status-codes';

// Manejo los errores desde cada metodo en este controlador

// Crear un área
export const createArea = async (req, res) => {
  try {
    const area = await Area.create(req.body);

    res.status(201).json(area);
  } catch (error) {
    let err = error.message;

    // console.log(err);

    err = Object.values(error.errors)
      .map((err) => err.message)
      .join(', ');

    res.status(500).json({
      message: 'Error al crear el área',
      err,
    });
  }
};

// Obtener todas las áreas
export const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find().select(
      '-__v -_id -createdAt -updatedAt -state'
    );
    res.status(StatusCodes.OK).json(areas);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener las áreas', error });
  }
};

// Obtener un área por ID
export const getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id).select(
      '-__v -_id -createdAt -updatedAt -state '
    );

    if (!area) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Área no encontrada' });
    }

    res.status(200).json(area);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el área', error });
  }
};

// Actualizar un área
export const updateArea = async (req, res) => {
  try {
    const updatedArea = await Area.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const responseArea = await Area.findById(req.params.id).select(
      '-__v -_id -createdAt -updatedAt -state '
    );

    if (!updatedArea) {
      return res.status(404).json({ message: 'Área no encontrada' });
    }
    res.status(200).json(responseArea);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el área', error });
  }
};

// Eliminar un área
export const deleteArea = async (req, res) => {
  try {
    const deletedArea = await Area.findByIdAndDelete(req.params.id);
    if (!deletedArea) {
      return res.status(404).json({ message: 'Área no encontrada' });
    }
    res.status(200).json({ message: 'Área eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el área', error });
  }
};
