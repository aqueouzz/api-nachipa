import express from 'express';
const router = express.Router();

import { registerUser } from '../controllers/authController.js';
import upload from '../middlewares/upload.js';

router.route('/register').post(upload.single('photoProfile'),registerUser);


export default router;