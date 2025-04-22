import express from 'express';
const router = express.Router();

import { registerUser } from '../controllers/authController.js';
import { validateRegisterInput } from '../middlewares/validationMiddleware.js';
import multer from '../middlewares/multerMiddleware.js';

router.route('/register').post(multer.single('photoProfile'),validateRegisterInput,registerUser);


export default router;