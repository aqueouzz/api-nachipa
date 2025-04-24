import express from 'express';
const router = express.Router();

import { registerUser,signIn,confirmationAccount,forgotPassword,newPassword,signout } from '../controllers/authController.js';
import { validateRegisterInput } from '../middlewares/validationMiddleware.js';
import multer from '../middlewares/multerMiddleware.js';

router.route('/register').post(multer.single('photoProfile'),validateRegisterInput,registerUser);
router.route('/confirmed-account/:token').get(confirmationAccount);
router.route("/reset-password").post(forgotPassword);
router.route("/reset-password/:token").post(newPassword);
router.route('/login').post(signIn);
router.route('/signout').get(signout);


export default router;