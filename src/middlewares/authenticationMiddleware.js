import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../error/errorResponse.js';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const userCount = await User.countDocuments();

  // ✅ Si no hay usuarios, permitir el paso sin importar headers
  if (userCount === 0) {
    return next(); // No hay usuarios: permite el acceso
  }

  // A partir de aquí, ya hay usuarios → sí validamos el token
  const authHeader = req.headers['authorization'];

  // console.log(authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError(
      'Acceso no autorizado. Por favor inicia sesión.'
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const { role } = decodedToken;
    // console.log(role);

    const validRoles = ['user', 'admin', 'superadmin'];

    if (!validRoles.includes(role)) {
      throw new ForbiddenError('Usuario debe tener un rol válido');
    }

    req.user = decodedToken;

    // console.log(req.user);

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthenticatedError(
        'Token expirado, por favor inicia sesión nuevamente'
      );
    }
    throw new UnauthenticatedError('Token inválido');
  }
};
