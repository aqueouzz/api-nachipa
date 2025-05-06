import mongoose from 'mongoose';
import { param, validationResult } from 'express-validator';
import { BadRequestError } from '../error/errorResponse.js';

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

//Validate ID param mongoDB
export const validateIdParam = withValidationErrors([
  param('id').custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError('Invalid MongoDB id');
  }),
]);
