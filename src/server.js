// Dependencies
import 'express-async-errors';
import app from './app.js';
import dotenv from 'dotenv';
import chalk from 'chalk';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Import db
import db from './config/db.js';

// Load env variables
dotenv.config();

// Port
const PORT = process.env.PORT || 3000;

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // versión de OpenAPI
    info: {
      title: 'Nachipa Wellboats API REST',
      version: '1.0.0',
      description: 'Documentación de mi API con Swagger',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api-nachipa/v1`,
      },
    ],
  },
  apis: ['./routes/*.js'], // Ruta a los archivos donde documentarás tus endpoints
  // apis: ['./routes/*.js'], // Ruta a los archivos donde documentarás tus endpoints
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const startServer = async () => {
  try {
    // Connect to database
    await db(process.env.MONGO_URI_DEV);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(chalk.bgGreen.black(`🚀 Server is running on port ${PORT}`));
    });
  } catch (error) {
    console.error(
      chalk.bgRed.white('❌ Database connection failed:', error.message)
    );
    process.exit(1);
  }
};

// Run server
startServer();
