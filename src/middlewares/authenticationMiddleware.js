import jwt from 'jsonwebtoken';
import { BadRequestError } from '../error/errorResponse.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // console.log(authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new BadRequestError('Falta token de autorizacion');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    next(error);
  }
};
