import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); // La carpeta donde se guardará el archivo
  },
  filename: (req, file, cb) => {
    cb(null, (Date.now() + req.body.username) + path.extname(file.originalname)); // Asigna un nombre único
  }
});

const fileFilter = (req, file, cb) => {
  // Aceptar solo imágenes (jpg, jpeg, png)
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return cb(new Error('Solo se permiten imágenes.'), false);
  }
  cb(null, true);
};

// Inicializa el middleware de Multer con la configuración de almacenamiento
const upload = multer({ storage,fileFilter  });

// Exporta el middleware
export default upload;