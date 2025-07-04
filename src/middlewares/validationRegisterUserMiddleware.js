import { body, param, validationResult } from 'express-validator';
import { BadRequestError } from '../error/errorResponse.js';
import User from '../models/User.js';
import Ubication from '../models/Ubication.js';
import Business from '../models/Business.js';
import Area from '../models/Area.js';
import Rol from '../models/Rol.js';
import Titulo from '../models/Titulo.js';
import mongoose from 'mongoose';

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
// 🚀 : UTILIZADO - Validate user register input
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
    .withMessage('Formato invalido de email')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError('email already exists');
      }
    }),
  body('businessID').custom(async (value, { req }) => {
    // Validar si el ID tiene formato válido de ObjectId
    // Validar formato de ObjectId
    if (!value) return true;

    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new BadRequestError('Invalid MongoDB id!!');
    }

    // Validar si existe en la base de datos
    const idBusiness = await Business.findById(req.body.businessID);
    if (!idBusiness) {
      throw new BadRequestError('Empresa no existe');
    }

    // Si pasa ambas validaciones, todo bien
    return true;
  }),
  body('ubicationID').custom(async (value, { req }) => {
    // Validar si el ID tiene formato válido de ObjectId
    // Validar formato de ObjectId
    if (!value) return true;

    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new BadRequestError('Invalid MongoDB id!!');
    }

    // Validar si existe en la base de datos
    const idUbication = await Ubication.findById(req.body.ubicationID);
    if (!idUbication) {
      throw new BadRequestError('Ubication no existe');
    }

    // Si pasa ambas validaciones, todo bien
    return true;
  }),
  body('professionalDegreeID').custom(async (value, { req }) => {
    // Validar si el ID tiene formato válido de ObjectId
    // Validar formato de ObjectId
    if (!value) return true;

    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new BadRequestError('Invalid MongoDB id!!');
    }

    // Validar si existe en la base de datos
    const idTitulo = await Titulo.findById(req.body.professionalDegreeID);
    if (!idTitulo) {
      throw new BadRequestError('Titulo no existe');
    }

    // Si pasa ambas validaciones, todo bien
    return true;
  }),
  body('areaID').custom(async (value, { req }) => {
    // Validar si el ID tiene formato válido de ObjectId
    // Validar formato de ObjectId
    if (!value) return true;

    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new BadRequestError('Invalid MongoDB id!!');
    }

    // Validar si existe en la base de datos
    const idArea = await Area.findById(req.body.areaID);
    if (!idArea) {
      throw new BadRequestError('Area no existe');
    }

    // Si pasa ambas validaciones, todo bien
    return true;
  }),
  body('rolID').custom(async (value, { req }) => {
    // Validar si el ID tiene formato válido de ObjectId
    // Validar formato de ObjectId
    if (!value) return true;

    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new BadRequestError('Invalid MongoDB id!!');
    }

    // Validar si existe en la base de datos
    const idRol = await Rol.findById(req.body.rolID);
    if (!idRol) {
      throw new BadRequestError('Rol no existe');
    }

    // Si pasa ambas validaciones, todo bien
    return true;
  }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long'),
  // body('accessAplications')
  //   .notEmpty()
  //   .withMessage('accessAplications es requerido por favor')
  //   .isIn(['omi', 'equipment'])
  //   .withMessage('Application must be omi || equipment'),
]);

// Validate business create input
export const validateRegisterBusinessInput = withValidationErrors([
  body('rut')
    .notEmpty()
    .withMessage('Rut es requerido')
    .custom(async (run) => {
      const rut = await User.findOne({ run });
      if (rut) {
        throw new BadRequestError('Rut ya existe');
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
        throw new BadRequestError('Formato invalido de rut');
      }
    }),
  body('name').notEmpty().withMessage('Nombre es requerido'),
  body('giro').notEmpty().withMessage('Giro es requerido'),
  body('commune')
    .notEmpty()
    .withMessage('Comuna es requerido')
    .isLength({ min: 2, max: 10 })
    .withMessage('Comuna debe tener 2 a 8 caracteres'),
  body('city')
    .notEmpty()
    .withMessage('Ciudad es requerido')
    .isLength({ min: 2, max: 15 })
    .withMessage('Ciudad debe tener 2 a 8 caracteres'),
  body('country')
    .notEmpty()
    .withMessage('Pais es requerido')
    .isLength({ min: 2, max: 15 })
    .withMessage('Pais debe tener 2 a 8 caracteres'),
  body('phone').notEmpty().withMessage('Fono es requerido'),
  body('email')
    .notEmpty()
    .withMessage('Email es requerido')
    .isEmail()
    .withMessage('Formato email invalido')
    .custom(async (email) => {
      const business = await Business.findOne({ email });
      if (business) {
        throw new BadRequestError('Correo ya existe');
      }
    }),
  body('nameContact').notEmpty().withMessage('Nombre contacto es requerido'),
]);

export const validateStatus = withValidationErrors([
  body('accessAplications')
    .notEmpty()
    .withMessage('accessAplications es requerido por favor')
    .isIn(['omi', 'equipment'])
    .withMessage('Application must be omi || equipment'),
]);
