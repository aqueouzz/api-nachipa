import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(morgan('tiny'));

// Carpeta estática para ver los archivos subidos
app.use('/uploads', express.static('src/uploads'));

//importing midedleware
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';

// Importing routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import businessRoutes from './routes/businessRoutes.js';

//Route default
app.get('/api-nachipa/v1', (req, res) => {
  res.send('Hello from the server-api Nachipa!');
});

// Routes API
app.use('/api-nachipa/v1/auth', authRoutes);
app.use('/api-nachipa/v1/user', userRoutes);
app.use('/api-nachipa/v1/business', businessRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);

export default app;
