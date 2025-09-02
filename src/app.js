// Dependencies
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import xss from 'xss-clean';

// Initializing the app with express
const app = express();

// Middlewares allows json format
app.use(express.json());

app.use(helmet());
if (process.env.NODE_ENV === 'production') {
  // 🟢 Producción: logs a archivo
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'logs', 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  // 🔵 Desarrollo: logs coloridos en consola
  app.use(morgan('dev'));
}
app.use(xss());

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(mongoSanitize());

// Task Notification Courses Expired
import './tasks/cronWorker.js';
import swagger from './config/swagger.js';

// Setting cors
const allowedOrigins = [
  'http://localhost:3000', // 👈 React dev server
  'http://localhost:5173', // 👈 Vite dev server
  'http://localhost:4500', // 👈 Tu backend
  'http://127.0.0.1:3000', // 👈 Alternativa localhost
  'http://127.0.0.1:5173', // 👈 Alternativa localhost
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    // allowedHeaders: ['Content-Type', 'Authorization'], // 👈 clave
  })
);

// Carpeta estática para ver los archivos subidos
app.use('/uploads', express.static('src/uploads'));

//importing midedleware
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';

// Importing routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import ubicationRoutes from './routes/ubicationRoutes.js';
import rolRoutes from './routes/rolRoutes.js';
import tituloRoutes from './routes/tituloRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import areaRoutes from './routes/areaRoutes.js';
import userCoursesRoutes from './routes/userCourses.js';

// Route default
app.get('/api-nachipa/v1', (req, res) => {
  res.send('Hello from the server-api Nachipa!');
});

// Routes API
app.use('/api-nachipa/v1/auth', authRoutes);
app.use('/api-nachipa/v1/user', userRoutes);
app.use('/api-nachipa/v1/business', businessRoutes);
app.use('/api-nachipa/v1/ubication', ubicationRoutes);
app.use('/api-nachipa/v1/rol', rolRoutes);
app.use('/api-nachipa/v1/titulo', tituloRoutes);
app.use('/api-nachipa/v1/course', courseRoutes);
app.use('/api-nachipa/v1/area', areaRoutes);
app.use('/api-nachipa/v1/user-courses', userCoursesRoutes);

swagger(app);

// Route not found
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'route not found' });
});

//Controller errors middleware App
app.use(errorHandlerMiddleware);

export default app;
