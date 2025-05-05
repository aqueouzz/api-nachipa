import User from "../models/User.js";
import { BadRequestError } from "../error/errorResponse.js";
import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";


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

  if (!user) req.body.state = true
    
  next();
};


//Validate ID param mongoDB
export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {

    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError("Invalid MongoDB id");
  }),
]);
