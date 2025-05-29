import path from 'path';
import User from '../models/User.js';
import StatusCodes from 'http-status-codes';
import fs from 'fs/promises';
import { BadRequestError, ForbiddenError } from '../error/errorResponse.js';

// 🚀 : Metodo GET ALLS
export const getAllUsers = async (req, res) => {
  // ✅ Buscamos el ID de la empresa del usuario autenticado
  let users;

  if (req.user.role !== 'superadmin') {
    users = await User.find({ businessID: req.user.businessID }).select(
      '-password -_id -token -confirmed'
    );
  } else {
    users = await User.find().select('-password -_id -token -confirmed');
  }

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
};

// 🚀 : Metodo GETBYID
export const getById = async (req, res) => {
  const { id } = req.params;

  const userExists = await User.findById(req.user.id).select(
    'businessID internalRol'
  );

  const user = await User.findById(id).select(
    '-password -_id -token -confirmed -state -accessAplications -internalRol'
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      msg: 'User not found',
    });
  }

  // 🖍️ : Esta logica aplicarla en un middleware
  const isSelf = req.user.id === id;
  const isAdmin = userExists.role === 'admin';
  const isSuperAdmin = userExists.role === 'superadmin';
  const sameBusiness = req.user.businessID === user.businessID;

  if (!isSelf && !(isSuperAdmin || (isAdmin && sameBusiness))) {
    throw new ForbiddenError('No tiene permisos para obtener este usuario!');
  }

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Usuario encontrado',
    data: user,
  });
};

// 🚀 : Metodo UPDATE
export const updateUser = async (req, res) => {
  // Obtenemos el ID de req.user que viene del login y guardado en el token
  const requesterUser = req.user;
  const user = await User.findById(req.body.id);

  const isSelf = user.id === requesterUser.id;
  const isAdmin = requesterUser.role === 'admin';
  const isSuperAdmin = requesterUser.role === 'superadmin';
  const sameBusiness = requesterUser.businessID === user.businessID.toString();

  // Usario debe estar confirmado para poder actualizar
  if (user.confirmed === false)
    throw new BadRequestError(
      'Usuario no puede actualizarse ya que no ha sido confirmado'
    );

  // Si no existe el usuario, retornamos un error
  if (!user)
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Id de usuario no encontrado' });

  // ✅ : Validamos ROLES INTERNOS “Si NO soy yo mismo y NO soy superadmin ni admin de la misma empresa → entonces no tengo permisos”.
  if (!isSelf && !(isSuperAdmin || (isAdmin && sameBusiness))) {
    throw new ForbiddenError('No tiene permisos para actualizar este usuario!');
  }

  // Si quiere actualizar validamos que venga algun archivo y que venga el campo photoProfile para actualizar su foto de perfil y los campos que puede actualizar
  if (req.file && user.photoProfile) {
    const oldPhoto = path.join('src/uploads', path.basename(user.photoProfile));
    console.log(oldPhoto);
    // Antes de guardar la nueva imagen, el código elimina la imagen anterior si existe:
    try {
      // Verifica si el archivo existe intentando acceder a él
      await fs.access(oldPhoto);

      // Si no lanza error, el archivo existe, entonces lo borramos
      await fs.unlink(oldPhoto);
      // console.log('Foto de perfil eliminada correctamente');
    } catch (err) {
      // Si el error es porque no existe el archivo, lo ignoramos
      if (err.code !== 'ENOENT') {
        throw new ErrorResponse(
          'Ha ocurrido un error al eliminar la foto de perfil anterior'
        );
      }
    }

    if (req.file) {
      // Crear nombre único de archivo
      const uploadDir = path.join('src/uploads');
      const extension = path.extname(req.file.originalname);
      const filename = `${Date.now()}-${user.username}${extension}`;
      const filePath = path.join(uploadDir, filename);
      try {
        await fs.mkdir(uploadDir, { recursive: true }); // No falla si ya existe
      } catch (err) {
        console.error('Error creando carpeta:', err);
        return res.status(500).json({
          success: false,
          message: 'Error al crear carpeta de subida.',
        });
      }

      // Guardar el archivo desde el buffer en disco
      try {
        await fs.writeFile(filePath, req.file.buffer);
        user.photoProfile = `/uploads/${filename}`;
      } catch (err) {
        console.error('Error al guardar archivo:', err);
        return res
          .status(500)
          .json({ success: false, message: 'Error al guardar la imagen.' });
      }

      // Asignar path accesible públicamente
      // Actualza la url de la imagen nueva
      const photoUrl = `/uploads/${filename}`;
      user.photoProfile = photoUrl;
    }
  }

  // Campos que solo el superadmin puede modificar
  const camposSoloSuperadmin = [
    'internalRol',
    'rol',
    'state',
    'username',
    'run',
    '_id',
    'token',
    'confirmed',
    'createdAt',
    'updatedAt',
    // 'lastName',
  ];

  // Si el usuario autenticado NO es superadmin, revisa si intenta modificar campos restringidos
  if (req.user.role !== 'superadmin') {
    for (const campo of camposSoloSuperadmin) {
      if (campo in req.body) {
        console.log(campo);
        return res.status(StatusCodes.FORBIDDEN).json({
          msg: `No tienes permisos para actualizar el campo: ${campo}`,
        });
      }
    }
  }

  // Recorre los campos que vienen en el body y los asigna al usuario
  Object.entries(req.body).forEach(([key, value]) => {
    user[key] = value;
  });

  user.updatedBy = requesterUser.id; // Actualiza el campo updatedBy con el ID del usuario que está haciendo la petición
  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'Usuario actualizado',
    data: user,
  });
};

// 🚀 : Metodo DELETE
export const deleteUser = async (req, res) => {
  const userID = await User.findById(req.params.id);

  if (!userID) throw new BadRequestError('Usuario no encontrado');

  // 🖍️ : Esta logica aplicarla en un middleware
  const isSelf = req.user.id === userID;
  const isAdmin = req.user.role === 'admin';
  const isSuperAdmin = req.user.role === 'superadmin';
  const sameBusiness = req.user.businessID === userID.businessID;

  // ✅ : “Si NO soy yo mismo y NO soy superadmin ni admin de la misma empresa → entonces no tengo permisos”.
  if (!isSelf && !(isSuperAdmin || (isAdmin && sameBusiness))) {
    throw new ForbiddenError('No tiene permisos para eliminar este usuario!');
  }

  const uploadsDir = path.join('src', 'uploads');

  const files = await fs.readdir(uploadsDir);

  const matches = files.filter((file) =>
    file.includes(userID.photoProfile.split('/')[2])
  );

  try {
    await fs.access(path.join(uploadsDir, matches.toString()));
    await fs.unlink(path.join(uploadsDir, matches.toString()));
  } catch (error) {
    throw new BadRequestError(
      'Ha ocurrido un error al eliminar la foto de perfil anterior',
      error
    );
  }

  await User.findByIdAndDelete(
    { _id: req.params.id },
    { returnDocument: 'before' }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    msg: 'User deleted',
  });
};
