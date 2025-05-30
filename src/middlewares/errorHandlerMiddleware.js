import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(err.message);
  // console.log(err._message);
  // console.error(err.stack);

  let msg = err.message || 'Something went wrong, try again later';
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // Manejar errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    msg = Object.values(err.errors)
      .map((err) => err.message)
      .join(', ');
  }

  // Manejar errores de código (errores inesperados)
  // Si no hay un mensaje definido, usa un mensaje genérico
  if (!err.message) {
    msg = 'An unexpected error occurred';
  }

  // Manejar errores de sintaxis
  if (
    err instanceof SyntaxError &&
    err.status === StatusCodes.BAD_REQUEST &&
    'body' in err
  ) {
    msg = 'Invalid JSON payload';
  }

  res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleware;
