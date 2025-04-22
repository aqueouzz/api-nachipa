import ErrorResponse from '../error/errorResponse.js'

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log('validando errores')

    next()
}

export default errorHandlerMiddleware