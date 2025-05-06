import { body, param, validationResult } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../error/errorResponse.js';
import User from '../models/User.js';

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        const firstMessage = errorMessages[0];
        // console.log(Object.getPrototypeOf(firstMessage));
        // if (errorMessages[0].startsWith("no job")) {
        //   throw new NotFoundError(errorMessages);
        // }
        // if (errorMessages[0].startsWith("not authorized")) {
        //   throw new UnauthorizedError("not authorized to access this route");
        // }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};
// Validate user register input
export const validateRegisterInput = withValidationErrors([
  body('run')
    .notEmpty()
    .withMessage('User name is requerido por favor')
    .custom(async (run) => {
      const rut = await User.findOne({ run });
      if (rut) {
        throw new BadRequestError('run already exists');
      }

      var Fn = {
        // Valida el rut con su cadena completa "XXXXXXXX-X"
        validaRut: function (rutCompleto) {
          rutCompleto = rutCompleto.replace('‐', '-');
          if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
          var tmp = rutCompleto.split('-');
          var digv = tmp[1];
          var rut = tmp[0];
          if (digv == 'K') digv = 'k';
          return Fn.dv(rut) == digv;
        },
        dv: function (T) {
          var M = 0,
            S = 1;
          for (; T; T = Math.floor(T / 10))
            S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
          return S ? S - 1 : 'k';
        },
      };

      if (!Fn.validaRut(run)) {
        throw new BadRequestError('Invalid run format');
      }
    }),
  body('username')
    .notEmpty()
    .withMessage('User name is requerido por favor')
    .custom(async (username) => {
      const us = await User.findOne({ username });
      if (us) {
        throw new BadRequestError('username already exists');
      }
    }),
  body('firstName').notEmpty().withMessage('firstName is required'),
  body('lastName').notEmpty().withMessage('lastName is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError('email already exists');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long'),
  body('accessAplications')
    .notEmpty()
    .withMessage('accessAplications es requerido por favor')
    .isIn(['omi', 'equipment'])
    .withMessage('Application must be omi || equipment'),
]);
