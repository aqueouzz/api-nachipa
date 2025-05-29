import express from 'express';
const router = express.Router();

import {
  registerUser,
  signIn,
  confirmationAccount,
  forgotPassword,
  newPassword,
  signout,
} from '../controllers/authController.js';

import { validateRegisterInput } from '../middlewares/validationRegisterUserMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';
import {
  existsUserWithState,
  validateEmail,
} from '../middlewares/validationsUserMiddleware.js';

import { authorizeAction } from '../middlewares/authorizedMiddleware.js';

import { authenticateToken } from '../middlewares/authenticationMiddleware.js';

router
  .route('/register')
  .post(
    authenticateToken,
    authorizeAction('create', 'user'),
    upload.single('photoProfile'),
    validateRegisterInput,
    validateEmail,
    existsUserWithState,
    registerUser
  );

router.route('/confirmed-account/:token').get(confirmationAccount);
router.route('/reset-password').post(forgotPassword);
router.route('/reset-password/:token').post(newPassword);
router.route('/login').post(signIn);
router.route('/signout').get(signout);

export default router;
