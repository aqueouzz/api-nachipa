// Dependencies
import StatusCodes from 'http-status-codes';

// Errors
import { BadRequestError, ForbiddenError } from '../error/errorResponse.js';

// Models
import Ubication from '../models/Ubication.js';
import User from '../models/User.js';

// 🚀 :  Create a new Ubication
export const createUbication = async (req, res) => {
  // ✅ : Validar que el usuario exista
  // ✅ : Validar existan ubicaciones
  // ✅ : Validar que el usuario admin pertenezca de la ubicación para crear
  // ✅ : Devolver la ubicacion ID
  const us = await User.findById(req.user.id).select('businessID internalRol');

  if (!us) {
    throw new BadRequestError('Usuario no encontrado');
  }

  // Crear una nueva ubicación y asociarla al usuario creador y empresa que viene en el req.user
  const ubication = new Ubication({
    ...req.body,
    createdBy: req.user.id,
    businessID: req.user.businessID,
  });

  if (
    us.internalRol !== 'superadmin' &&
    ubication.businessID.toString() !== us.businessID.toString()
  ) {
    throw new ForbiddenError('No tiene permisos para crear esta ubicación');
  }

  // Crear la ubicación en la base de datos
  await ubication.save();

  // Responde con la ubicación creada
  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: 'Ubication creada',
    data: ubication,
  });
};

// 🚀 : Get All Ubication
export const getAllUbication = async (req, res) => {
  // ✅ : Validar que existan ubicaciones
  // ✅ : Validar que el usuario admin pertenezca de la ubicación
  // ✅ : Devolver la ubicacion ID
  const targetUserDB = await User.findById(req.user.id).select(
    'businessID internalRol'
  );

  // El superadmin puede ver todas las ubicaciones
  if (req.user.role === 'superadmin') {
    const ubic = await Ubication.find();

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: 'Ubicaciones encontradas',
      count: ubic.length,
      data: ubic,
    });
  }

  const ub = await Ubication.find({ businessID: req.user.businessID });

  if (
    targetUserDB.internalRol !== 'superadmin' &&
    req.user.businessID !== targetUserDB.businessID.toString()
  ) {
    throw new ForbiddenError('No tiene permisos para obtener ubicaciones');
  }

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Ubicationes encontradas',
    count: ub.length,
    data: ub,
  });
};

// 🚀 : Get getBYID
export const getUbication = async (req, res) => {
  // ✅ : Validar que la ubicacion exista
  // ✅ : Validar que el usuario exista
  // ✅ : Validar que el usuario admin pertenezca de la ubicación
  // ✅ : Devolver la ubicacion ID

  const ubication = await Ubication.findById(req.params.id);

  if (!ubication) {
    throw new BadRequestError('Ubication no encontrada');
  }

  const us = await User.findById(req.user.id).select('businessID internalRol');

  if (!us) {
    throw new BadRequestError('Usuario no encontrado');
  }

  if (
    us.internalRol !== 'superadmin' &&
    ubication.businessID.toString() !== us.businessID.toString()
  ) {
    throw new ForbiddenError('No tiene permisos para obtener esta ubicación');
  }

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Ubication encontrada',
    data: ubication,
  });
};

// 🚀 : Updated Ubication
export const updateUbication = async (req, res) => {
  // ✅ : Validar que la ubicacion exista
  // ✅ : Validar que el usuario exista
  // ✅ : Validar que el usuario admin pertenezca a la empresa de la ubicacion
  // ✅ : Validar que el usuario tenga una ubicacion valida
  // ✅ : Devolver la ubicacion actualizada
  const { id } = req.params;

  const ubication = await Ubication.findById(id);

  if (!ubication) {
    throw new BadRequestError('Ubicacion no encontrada');
  }

  const us = await User.findById(req.user.id).select('businessID internalRol');
  const bussID = us.businessID.toString();

  if (!us) {
    throw new BadRequestError('Usuario no encontrado');
  }

  // if (req.user.role === 'superadmin') {
  //   const ubic = await Ubication.findByIdAndUpdate(id, req.body, {
  //     new: true,
  //     runValidators: true,
  //   });

  //   return res.status(StatusCodes.OK).json({
  //     success: true,
  //     msg: 'Ubicaciones actualizada',
  //     data: ubic,
  //   });
  // }

  // if (ubication.businessID.toString() !== bussID) {
  //   throw new BadRequestError('Usuario no pertenece a la empresa');

  // }

  if (
    us.internalRol !== 'superadmin' &&
    ubication.businessID.toString() !== us.businessID.toString()
  ) {
    throw new ForbiddenError(
      'No tiene permisos para actualizar esta ubicación'
    );
  }

  const ubicationUpdate = await Ubication.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Ubication actualizada',
    data: ubicationUpdate,
  });
};

// 🚀 : Delete a new Ubication
export const deleteUbication = async (req, res) => {
  // ✅ : Validar que la ubicacion exista
  // ✅ : Validar que el usuario exista
  // ✅ : Validar que el usuario admin pertenezca de la ubicación
  // ✅ : Eliminar la ubicacion
  const { id } = req.params;

  const ubication = await Ubication.findById(id);

  if (!ubication) {
    throw new BadRequestError('Ubicacion no encontrada');
  }

  const us = await User.findById(req.user.id).select('businessID');
  const bussID = us.businessID.toString();

  if (!us) {
    throw new BadRequestError('Usuario no encontrado');
  }

  if (req.user.role === 'superadmin') {
    await Ubication.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({
      success: true,
      msg: 'Ubication eliminada',
    });
  }

  if (ubication.businessID.toString() !== bussID) {
    throw new BadRequestError('Usuario no pertenece a la empresa');
  }

  await Ubication.findByIdAndDelete(id);

  // 5. Respuesta
  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Ubication eliminada correctamente ',
  });
};
