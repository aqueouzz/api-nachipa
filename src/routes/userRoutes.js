import express from "express";
const router = express.Router();
import multer from '../middlewares/multerMiddleware.js';

import {
  getAllUsers,
  getById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import { validateIdParam } from "../middlewares/validationsUserMiddleware.js";

router.route("/").get(getAllUsers);
router.route("/:id").get(validateIdParam, getById);
router.route("/:id").patch(multer.single('photoProfile'),validateIdParam, updateUser);
router.route("/:id").delete(validateIdParam, deleteUser);

export default router;
