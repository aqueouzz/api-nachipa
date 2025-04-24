import express from 'express';
const router = express.Router();

import {getAllUsers,getById} from '../controllers/userController.js'
import {validateIdParam} from '../middlewares/validationMiddleware.js'

router.route('/').get(getAllUsers)
router.route('/:id').get(validateIdParam,getById)


export default router;
