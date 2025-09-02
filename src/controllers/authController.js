// Dependencies
import { StatusCodes } from 'http-status-codes';
import fs from 'fs/promises';
import path from 'path';

// Importar modelos
import User from '../models/User.js';
import logger from '../utils/logger.js';
import { authenticateToken } from '../middlewares/authenticationMiddleware.js';
import { authorizeAction } from '../middlewares/authorizedMiddleware.js';
// Utils
import { emailRegister, resetPassword } from '../utils/email.js';

// Errors
import {
  UnauthenticatedError,
  BadRequestError,
  ForbiddenError,
} from '../error/errorResponse.js';

export const gateRegister = async (req, res, next) => {
  const count = await User.countDocuments();
  if (count === 0) {
    // primer usuario: NO pedir token ni permisos
    return next();
  }
  // ya hay usuarios → ahora sí exigimos token + permisos
  return authenticateToken(req, res, (err) => {
    if (err) return next(err);
    return authorizeAction('create', 'user')(req, res, next);
  });
};
//🚀 : Create a new user
export const registerUser = async (req, res, next) => {
  const totalUsers = await User.countDocuments();

  // Si no hay usuarios, se permite omitir "createdBy"
  const isFirstUser = totalUsers === 0;

  // ✅ Si NO es el primer usuario, exigir auth y rol
  if (!isFirstUser) {
    if (!req.user) {
      throw new UnauthenticatedError('Acceso no autorizado. Inicia sesión.');
    }
    if (req.user.role !== 'superadmin') {
      throw new ForbiddenError('Solo el superadmin puede crear usuarios');
    }
  }

  try {
    const userData = {
      ...req.body,
    };

    if (isFirstUser) {
      //Forzar rol superadmin en el primer usuario
      userData.internalRol = 'superadmin';
      userData.createdBy = null;
    }

    if (!isFirstUser) {
      userData.createdBy = req.user.id;
    }

    const user = new User(userData);
    const token = user.createToken();
    user.token = token;

    if (req.file === undefined) {
      let imageDefault = path.join('src/uploads/user-default.png');
      let newImageDefault = path.join(
        `src/uploads/user-default-${user.username}.png`
      );

      try {
        // Crear nombre único de archivo
        const buffer = await fs.readFile(imageDefault);

        // console.log(buffer);
        await fs.writeFile(newImageDefault, buffer);

        user.photoProfile = newImageDefault.replace(/\\/g, '/');

        // user.photoProfile = `/uploads/${filename}`;
      } catch (err) {
        console.error('Error al leer la imagen:', err);
      }
    }

    if (req.file) {
      const uploadDir = path.join('src/uploads');
      const extension = path.extname(req.file.originalname);
      const filename = `${Date.now()}-${user.username}${extension}`;
      const filePath = path.join(uploadDir, filename);
      try {
        await fs.mkdir(uploadDir, { recursive: true }); // No falla si ya existe
      } catch (err) {
        console.error('Error creando carpeta:', err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: 'Error al guardar la imagen.' });
      }
    }

    await user.save();

    // Envío de email
    emailRegister({
      email: user.email,
      firstName: user.firstName,
      token: token,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: 'User created', user, token });
  } catch (error) {
    next(error);
  }
};

//🚀 : Sign in account
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new UnauthenticatedError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Correo no es valido');
  }

  if (!user.confirmed) {
    throw new BadRequestError('No ha confirmado su cuenta');
  }

  const isPassword = await user.validatePassword(password);

  if (!isPassword) {
    logger.error(`signIn : User ${user.email} failed login`);
    throw new UnauthenticatedError('Clave incorrecta!');
  }

  const token = user.createToken();

  req.headers.authorization = `Bearer ${token}`;

  res.cookie('t', token, {
    httpOnly: true, // Protege contra XSS
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'Strict', // Previene ataques CSRF
    maxAge: 3600000, // 1 hora
  });

  logger.info(`signIn : User ${user.email} logged in`);

  res.status(StatusCodes.OK).json({ user: user.firstName, token: token });
};

//🚀 : Confimation account
export const confirmationAccount = async (req, res) => {
  const { token } = req.params;

  const userConfirm = await User.findOne({ token });

  if (!userConfirm) {
    throw new BadRequestError('Token no valido o expirado');
  }

  const { email } = userConfirm;
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError('No existe el usuario');
  }

  userConfirm.confirmed = true;
  userConfirm.token = '';

  await userConfirm.save();

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: 'Cuenta confirmada correctamente' });
};

//🚀 : Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  //Comprobamos si el user existe
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError('El usuario no existe');
  }

  user.token = user.createToken();
  await user.save();

  //Enviamos el email
  resetPassword({
    email: user.email,
    firstName: user.firstName,
    token: user.token,
  });

  res.json({
    success: true,
    msg: 'Hemos enviado un email para reestablecer tu clave',
  });
};

//🚀 : Reset password
export const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  if (user) {
    user.password = password;
    user.token = '';
    logger.info(
      `Reset password: Usuario ${user.email} (ID: ${user.id}) ha cambiado su contraseña`
    );
    await user.save();
    res.json({ msg: 'Usuario modificado correctamente' });
  } else {
    throw new BadRequestError('Token invalido');
  }
};

//🚀 : Sign out account
export const signout = (req, res) => {
  const { id, email, businessID } = req.user;

  logger.info(
    `Logout: Usuario ${email} (ID: ${id} Empresa: ${businessID}) cerró sesión`
  );

  res.clearCookie('t');

  delete req.headers.authorization;
  delete req.headers['x-auth-token'];
  delete req.headers['x-access-token'];
  delete req.headers.cookie;

  res.json({
    success: true,
    msg: 'Signout success, token and headers cleared',
  });
};
