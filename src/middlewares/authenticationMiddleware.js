// middlewares/authenticationMiddleware.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {
  UnauthenticatedError,
  ForbiddenError,
} from '../error/errorResponse.js';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const userCount = await User.countDocuments();
  if (userCount === 0) return next();

  const authHeader = req.headers['authorization'];
  const fromHeader = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;
  const fromCookie = req.cookies?.t || null; // requiere cookie-parser
  const token = fromHeader || fromCookie;
  if (!token)
    throw new UnauthenticatedError(
      'Acceso no autorizado. Por favor inicia sesión.'
    );

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const role = String(
      decoded.role ?? decoded.internalRol ?? ''
    ).toLowerCase();
    const valid = ['user', 'admin', 'superadmin'];
    if (!valid.includes(role))
      throw new ForbiddenError('Usuario debe tener un rol válido');

    let businessID = decoded.businessID ?? null;
    if (businessID && !mongoose.Types.ObjectId.isValid(businessID))
      businessID = null;

    req.user = {
      ...decoded,
      role,
      businessID,
      isSuperadmin: role === 'superadmin',
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthenticatedError(
        'Token expirado, por favor inicia sesión nuevamente'
      );
    }
    throw new UnauthenticatedError('Token inválido');
  }
};
