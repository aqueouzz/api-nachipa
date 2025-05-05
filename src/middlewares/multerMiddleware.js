import multer from "multer";
import {
  BadRequestError,
} from "../error/errorResponse.js";

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return cb(new BadRequestError("Solo se permiten imágenes JPG o PNG."), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo opcional (5MB)
});

export default upload;