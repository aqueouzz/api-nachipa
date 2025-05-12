import JWT from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { permissions } from '../utils/permissions.js';

import { BadRequestError } from '../error/errorResponse.js';

export const authorizedMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decodedToken = JWT.verify(token, process.env.JWT_SECRET);
  req.user = decodedToken;

  const { role } = decodedToken;

  const validRoles = ['user', 'admin', 'superadmin'];

  if (!validRoles.includes(role)) {
    throw new BadRequestError('Usuario debe tener un rol válido');
  }

  if (role === 'user' || role === undefined) {
    throw new BadRequestError('User is not authorized to access this route');
  }

  next();
};

export const authorizeAction = (action) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    console.log(userRole);

    if (!userRole) {
      throw new BadRequestError('Rol no definido');
    }

    const allowedActions = permissions[userRole] || [];

    console.log(allowedActions);

    if (!allowedActions.includes(action)) {
      throw new BadRequestError(
        `No tienes permiso para realizar esta acción: ${action}`
      );
    }

    next();
  };
};
