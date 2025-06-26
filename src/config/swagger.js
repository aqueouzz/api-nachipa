// Dependencies
import swaggerJSDoc from 'swagger-jsdoc';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nachipa Wellboats API REST',
      version: '1.0.0',
      description: 'Documentación de la API REST de Nachipa Wellboats',
    },
    servers: [
      {
        url: 'http://localhost:4500/api-nachipa/v1', // cambia esto si es necesario
      },
    ],
  },
  apis: ['./src/routes/*.js'], // cambia la ruta según tu estructura
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app) => {
  app.use(
    '/api-nachipa/v1/docs',
    swaggerUi.serve,
    (req, res, next) => {
      // Configurar headers de CSP
      res.setHeader(
        'Content-Security-Policy',
        "script-src 'self' https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/ 'sha256-ieoeWczDHkReVBsRBqaal5AFMlBtNjMzgwKvLqi/tSU='; style-src 'self' https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/ 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/;"
      );
      next();
    },
    swaggerUi.setup(swaggerSpec, options)
  );
};

export default setupSwaggerDocs;
