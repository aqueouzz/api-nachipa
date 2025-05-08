import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';

//Initializing the app with express
const app = express();

//Middlewares allows json format
app.use(express.json());
//Is used to log http requests arriving at my server - options ['dev', 'tiny']
app.use(morgan('dev'));

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

//Route default
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

//Route not found
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'route not found' });
});

//Controller errors middleware App
app.use(errorHandlerMiddleware);

export default app;
