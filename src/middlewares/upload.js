import multer from "multer";
import path from "path";

//Configuration de multer pour le stockage des fichiers

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// Filtro para solo aceptar imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValid = allowedTypes.test(file.mimetype);
  cb(null, isValid);
};

const upload = multer({ storage, fileFilter });


export default upload