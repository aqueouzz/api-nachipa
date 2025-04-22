import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../error/errorResponse.js";
import mongoose from "mongoose";
import User from "../models/User.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        const firstMessage = errorMessages[0];
        console.log(Object.getPrototypeOf(firstMessage));
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route");
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};
// Validate user register input
export const validateRegisterInput = withValidationErrors([
  body("run")
    .notEmpty()
    .withMessage("run is required")
    .custom(async (run) => {
      const rut = await User.findOne({ run });
      if (rut) {
        throw new BadRequestError("run already exists");
      }
    }),
  body("username").notEmpty().withMessage("username is required"),
  body("firstName").notEmpty().withMessage("firstName is required"),
  body("lastName").notEmpty().withMessage("lastName is required"),
  body("birthDate").notEmpty().withMessage("birthDate is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError('email already exists');
      }
    }),
  body("direction").notEmpty().withMessage("direction is required"),
  body("phone").notEmpty().withMessage("phone is required"),
  body("businessID").notEmpty().withMessage("businessID is required"),
  body("ubicationID").notEmpty().withMessage("ubicationID is required"),
  body("areaID").notEmpty().withMessage("areaID is required"),
  body("professionalDegreeID").notEmpty().withMessage("professionalDegreeID is required"),
  body("rol").notEmpty().withMessage("rol is required"),
  body("internalRol").notEmpty().withMessage("internalRol is required"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  body("state").notEmpty().withMessage("state is required"),
  body("accessAplications").notEmpty().withMessage("accessAplications is required"),
]);

//Validate id param mongoDB
export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError("invalid MongoDB id");
  }),
]);
