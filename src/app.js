// Dependencies
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import cron from 'node-cron';
import checkExpiringCourses from './tasks/checkExpiringCourses.js';

// Initializing the app with express
const app = express();

// Middlewares allows json format
app.use(express.json());
// Is used to log http requests arriving at my server - options ['dev', 'tiny']
app.use(morgan('dev'));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(mongoSanitize());

// Task Notification Courses Expired
import './tasks/cronWorker.js';

// Setting cors
const allowedOrigins = ['http://localhost:4500'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
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

// Route not found
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'route not found' });
});

//Controller errors middleware App
app.use(errorHandlerMiddleware);

export default app;
