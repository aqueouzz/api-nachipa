import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../error/errorResponse.js';
import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { isDomainValid } from '../utils/email.js';

// 🚀 : UTILIZADO -
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

export const existsUserWithState = async (req, res, next) => {
  const { username } = req.body;
  let user = await User.findOne({ username });

  if (!user) req.body.state = true;

  next();
};

//Validate ID param mongoDB
export const validateIdParam = withValidationErrors([
  param('id').custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    console.log(new mongoose.Types.ObjectId(value));
    if (!isValidMongoId) throw new BadRequestError('Invalid MongoDB id');
  }),
]);

// Validate body object IDs
export const validateBodyObjectIds =
  (fields = []) =>
  (req, res, next) => {
    const invalidFields = fields.filter(
      (field) =>
        field in req.body && !mongoose.Types.ObjectId.isValid(req.body[field])
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        msg: `IDs inválidos en los campos: ${invalidFields.join(', ')}`,
      });
    }

    next();
  };

// 🚀 : UTILIZADO -  Recibe un arreglo de objetos con el nombre del campo y el modelo correspondiente
/**
 * Valida formato y existencia de ObjectIds en body, params o query.
 * @param {Array} fieldsWithModels - Arreglo de objetos: { field, model, location }
 * location puede ser: 'body' | 'params' | 'query'
 */
// export const validateObjectIdsAndExistence = (fieldsWithModels = []) => {
//   return async (req, res, next) => {
//     try {
//       for (const { field, model, location = 'body' } of fieldsWithModels) {
//         const value = req[location]?.[field];
//         console.log(value);
//         // Ignorar si no se envía
//         if (!value) continue;

//         // Validar formato
//         if (!mongoose.Types.ObjectId.isValid(value)) {
//           return res.status(400).json({
//             msg: `Formato inválido para el campo: ${field} en ${location}`,
//           });
//         }

//         // Verificar existencia
//         const exists = await model.findById(value);
//         if (!exists) {
//           return res.status(404).json({
//             msg: `No se encontró el documento relacionado con el campo: ${field}`,
//           });
//         }
//       }

//       next();
//     } catch (err) {
//       console.error('Error validando IDs:', err);
//       return res.status(500).json({
//         msg: 'Error interno al validar ObjectIds',
//       });
//     }
//   };
// };

export const validateObjectIdsAndExistence = (fieldsWithModels = []) => {
  return async (req, res, next) => {
    try {
      for (const {
        field,
        model,
        location = 'body',
        required = true,
      } of fieldsWithModels) {
        const value =
          location === 'params'
            ? req.params[field]
            : location === 'query'
              ? req.query[field]
              : location === 'user'
                ? req.user?.[field]
                : req.body[field]; // por defecto body

        // console.log('>> Validando businessID desde req.user');
        // console.log('Valor:', value);
        // console.log('Tipo:', typeof value);

        // const exists = await model.findById(value);
        // console.log('Existe?:', exists);

        // console.log(model.modelName);

        // Si es requerido y no viene
        // if (required && !value) {
        //   return res.status(StatusCodes.BAD_REQUEST).json({
        //     msg: `El campo '${field}' es requerido en ${location}`,
        //   });
        // }

        // Si es requerido y no viene
        if (
          required &&
          Object.prototype.hasOwnProperty.call(location, field) &&
          !value
        ) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            msg: `El campo '${field}' es requerido en ${location}`,
          });
        }

        // Si viene pero no es un ObjectId válido
        if (value && !mongoose.Types.ObjectId.isValid(value)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            msg: `El valor del campo '${field}' no es un ObjectId válido`,
          });
        }

        // Si es válido, buscar el documento
        if (value) {
          const doc = await model.findById(value);
          if (!doc) {
            return res.status(StatusCodes.NOT_FOUND).json({
              msg: `No se encontró el ${field} documento en '${model.modelName}'`,
            });
          }

          // Guardamos el doc encontrado con nombre como `userDoc`, `businessDoc`, etc.
          const camelField = `${field.replace('ID', '').replace('Id', '')}Doc`;
          req[camelField] = doc;
        }
      }

      next();
    } catch (err) {
      console.error('Error en middleware validateObjectIdsAndExistence:', err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: 'Error interno del servidor al validar los ObjectIds.',
      });
    }
  };
};

//Validacion dominio de correo
const isValidEmailFormat = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email || !isValidEmailFormat(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Formato de email inválido' });
  }

  const domainValid = await isDomainValid(email);
  if (!domainValid) {
    return res.status(400).json({
      success: false,
      message: 'El dominio del email no puede recibir correos',
    });
  }

  next();
};
