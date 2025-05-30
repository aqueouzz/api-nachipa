// Dependencies
import { body, param, validationResult } from 'express-validator';
import { BadRequestError } from '../error/errorResponse.js';
import mongoose from 'mongoose';

// Models
import UserCourse from '../models/UserCourse.js';

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        const firstMessage = errorMessages[0];
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateStatus = withValidationErrors([
  body('status')
    .notEmpty()
    .withMessage('accessAplications es requerido por favor')
    .isIn(['Pendiente', 'Completado'])
    .withMessage('Estatus debe ser Pendiente || Completado'),
  body('managementOrOperation')
    .notEmpty()
    .withMessage('accessAplications es requerido por favor')
    .isIn(['Gestion', 'Operacion', 'Apoyo'])
    .withMessage('Alternativa debe ser Gestion || Operacion || Apoyo'),
]);
