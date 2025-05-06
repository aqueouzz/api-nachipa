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
import { validateRegisterInput } from '../middlewares/validationMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';
import {
  existsUserWithState,
  validateEmail,
} from '../middlewares/validationsUserMiddleware.js';

router
  .route('/register')
  .post(
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
