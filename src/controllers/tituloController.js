// Dependencies
import { validatePaginationParams } from '../utils/validatePagination.js';
import StatusCodes from 'http-status-codes';
// Models
import Titulo from '../models/Titulo.js';

// Create a new Titulo
export const createTitulo = async (req, res) => {
  // Creamos un objeto response con los datos que vienen del body
  const response = {
    institution: req.body.institution,
    name: req.body.name,
    description: req.body.description,
    createdBy: req.user.id,
  };

  // Creamos el titulo con el modelo Titulo
  const titulo = await Titulo.create(response);

  // Vuelves a buscar solo lo que necesitas
  const tituloResponse = await Titulo.findById(titulo._id).select('name');

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: 'Titulo creado correctamente',
    data: tituloResponse,
  });
};

// Get All Titulos
export const getAllTitulos = async (req, res) => {
  // 1.- Buscamos los titulos creados por el usuario superadmin
  // ya que otro usuario no puede realizar oepraciones CRUD sobre los titulos
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

  query.createdBy = req.user.id;

  const titulos = await Titulo.find(query)
    .sort({ name: orderValue })
    .skip(skip)
    .limit(limit)
    .select('-__v -_id -createdAt -updatedAt -__v -createdAt -updatedAt');

  const titulosCount = await Titulo.countDocuments();

  if (titulosCount === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      msg: 'No se encontraron titulos registrados',
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Titulos obtenidos correctamente',
    count: titulos.length,
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
  await Titulo.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user.id },
    {
      new: true,
    }
  );

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
