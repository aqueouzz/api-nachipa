// Models
import Area from '../models/Area.js';
import Ubication from '../models/Ubication.js';
import User from '../models/User.js';
import Business from '../models/Business.js';

// Dependencies
import StatusCodes from 'http-status-codes';
import { validatePaginationParams } from '../utils/validatePagination.js';

// Errors
import { BadRequestError, ForbiddenError } from '../error/errorResponse.js';

// 🚀 : Crear un área
export const createArea = async (req, res) => {
  /*
  ✅ Validaciones necesarias
        El usuario autenticado existe y tiene una empresa asignada.

        La ubicationID que viene en req.body existe.

        Esa ubicación pertenece a la misma empresa del usuario (ubication.businessID === user.businessID).

        Si se cumple todo, se permite la creación.
  */

  const user = await User.findById(req.user.id);
  // const user = await User.findById(req.user.id).select('businessID');

  if (!user) {
    throw new BadRequestError('Usuario no existe');
  }

  // Validar que la ubicacionID que viene en el body exista, y obtengo su businessID
  const ubicationValid = await Ubication.findById(req.body.ubicationID).select(
    'businessID'
  );

  if (!ubicationValid) {
    throw new BadRequestError('Ubication ID no existe');
  }

  // Validar que la ubicacionID pertenezca a la empresa del usuario y si es superadmin
  // si puede crear el área
  const isSuperAdmin = req.user.role === 'superadmin';
  const isAdmin = req.user.role === 'admin';
  const someBusiness =
    ubicationValid.businessID.toString() === req.user.businessID.toString();

  // Valido si esto lo cumple
  const isAuthorized = isSuperAdmin || (isAdmin && someBusiness);

  // Si no es superadmin ,
  // pero si es admin y la ubicacionID pertenece a la empresa del usuario
  // puede puede crear el área
  if (!isAuthorized) {
    throw new ForbiddenError('No tiene permisos para crear un área');
  }

  const area = new Area({
    ...req.body,
    createdBy: req.user.id,
  });

  await area.save();

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: 'Area creadad correctamente',
    data: area,
  });
};

// 🚀 : Obtener todas las áreas
// * * En el select se filtra , busca los campos que especifique el usuario
export const getAllAreas = async (req, res) => {
  const { q, order, status, startDate, endDate } = req.query;

  const { page, limit, skip } = validatePaginationParams(req.query);

  // Construir query base
  let query = {};
  // 1.- Validar que el usuario exista y tenga una empresa asignada
  const businessExists = await Business.findById(req.user.businessID);

  if (!businessExists) {
    throw new BadRequestError(
      'No existe una empresa valida asignada al usuario'
    );
  }

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

  // let areas;

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

  const areas = await Area.find(query)
    .sort({ name: orderValue })
    .skip(skip)
    .limit(limit);

  const ubications = await Ubication.find({
    businessID: req.user.businessID,
  }).select('_id');

  if (req.user.role === 'superadmin') {
    query = areas;
  } else {
    query = await Area.find({ ubicationID: { $in: ubications } });
  }

  const totalArea = await Area.countDocuments();

  if (totalArea === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      msg: 'No se encontraron áreas registrados',
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Áreas obtenidas correctamente',
    count: query.length,
    data: query,
    totalAreas: totalArea,
  });
};

// 🚀 :  Obtener un área por ID
export const getAreaById = async (req, res) => {
  // 1. Buscar al usuario actual y validar que tenga empresa
  // y devolvemos el businessID e internalRols
  const user = await User.findById(req.user.id).select(
    'businessID internalRol ubicacionID'
  );

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      msg: 'Usuario no encontrado',
    });
  }

  // 2- Validar que el área exista
  const area = await Area.findById(req.params.id).select(
    '-__v -createdAt -updatedAt -state'
  );

  if (!area) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      msg: 'Área no encontrada',
    });
  }

  // 3. Buscar la ubicación asociada al área
  const ubication = await Ubication.findById(area.ubicationID);

  if (!ubication) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      msg: 'Ubicación asociada al área no encontrada',
    });
  }

  // 4. Validar permisos
  // // Validar que la ubicacionID pertenezca a la empresa del usuario y si es superadmin
  // // si puede crear el área
  const isSuperAdmin = req.user.role === 'superadmin';
  const isAdmin = req.user.role === 'admin';
  // Verificar si la ubicación pertenece a la misma empresa que el usuario
  const sameBusiness = ubication.businessID.toString() === req.user.businessID;

  // Valido si esto lo cumple
  // si es admin y la ubicacionID pertenece a la empresa del usuario
  const isAuthorized = isAdmin && sameBusiness;

  if (!isSuperAdmin) {
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        msg: 'No tiene permisos para ver esta área',
      });
    }
  }

  // 5. Respuesta
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Área obtenida',
    data: area,
  });
};

// 🚀 : Actualizar un área
export const updateArea = async (req, res) => {
  // 1. Buscar al usuario actual y validar que tenga empresa
  // y devolvemos el businessID e internalRols
  const user = await User.findById(req.user.id).select(
    'businessID internalRol ubicacionID'
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      msg: 'Usuario no encontrado',
    });
  }

  // 2- Validar que el área exista
  const area = await Area.findById(req.params.id).select(
    '-__v -createdAt -updatedAt -state'
  );

  if (!area) {
    return res.status(404).json({
      success: false,
      msg: 'Área no encontrada',
    });
  }

  // 3. Buscar la ubicación asociada al área
  const ubication = await Ubication.findById(area.ubicationID);

  if (!ubication) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      msg: 'Ubicación asociada al área no encontrada',
    });
  }

  // 4. Validar permisos
  const isSuperAdmin = req.user.role === 'superadmin';
  const isAdmin = req.user.role === 'admin';
  // Verificar si la ubicación pertenece a la misma empresa que el usuario
  const sameBusiness = ubication.businessID.toString() === req.user.businessID;

  // Valido si esto lo cumple
  // si es admin y la ubicacionID pertenece a la empresa del usuario
  const isAuthorized = isAdmin && sameBusiness;

  if (!isSuperAdmin) {
    if (!isAuthorized) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: 'No tiene permisos para ver esta área',
      });
    }
  }

  const updatedArea = await Area.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // 5. Respuesta
  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Área actualizada correctamente',
    data: updatedArea,
  });
};

// 🚀 : Eliminar un área
export const deleteArea = async (req, res) => {
  // 1. Buscar al usuario actual y validar que tenga empresa
  // y devolvemos el businessID e internalRols
  const user = await User.findById(req.user.id).select(
    'businessID internalRol ubicacionID'
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      msg: 'Usuario no encontrado',
    });
  }

  // 2- Validar que el área exista
  const area = await Area.findById(req.params.id).select(
    '-__v -createdAt -updatedAt -state'
  );

  if (!area) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      msg: 'Área no encontrada',
    });
  }

  // 3. Buscar la ubicación asociada al área
  const ubication = await Ubication.findById(area.ubicationID);

  if (!ubication) {
    return res.status(404).json({
      success: false,
      msg: 'Ubicación asociada al área no encontrada',
    });
  }

  // 4. Validar permisos
  // // Validar que la ubicacionID pertenezca a la empresa del usuario y si es superadmin
  // // si puede crear el área
  const isSuperAdmin = req.user.role === 'superadmin';
  const isAdmin = req.user.role === 'admin';
  // Verificar si la ubicación pertenece a la misma empresa que el usuario
  const sameBusiness = ubication.businessID.toString() === req.user.businessID;

  // Valido si esto lo cumple
  // si es admin y la ubicacionID pertenece a la empresa del usuario
  const isAuthorized = isAdmin && sameBusiness;

  if (!isSuperAdmin) {
    if (!isAuthorized) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: 'No tiene permisos para ver esta área',
      });
    }
  }

  await Area.findByIdAndDelete(req.params.id);

  // 5. Respuesta
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: 'Área eliminada correctamente' });
};
