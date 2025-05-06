import { Router } from 'express';
import { createBusiness } from '../controllers/businessController.js';
import { validateRegisterBusinessInput } from '../middlewares/validationMiddleware.js';

const route = Router();

route.post('/', validateRegisterBusinessInput, createBusiness);

export default route;
