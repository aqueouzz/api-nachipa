import express from 'express';
const router = express.Router();

import {
  registerUser,
  signIn,
  confirmationAccount,
  forgotPassword,
  newPassword,
  signout,
  gateRegister,
} from '../controllers/authController.js';

import { validateRegisterInput } from '../middlewares/validationRegisterUserMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';
import {
  existsUserWithState,
  validateEmail,
} from '../middlewares/validationsUserMiddleware.js';

import { authorizeAction } from '../middlewares/authorizedMiddleware.js';

import { authenticateToken } from '../middlewares/authenticationMiddleware.js';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - run
 *               - username
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - password
 *             properties:
 *               run:
 *                 type: string
 *               username:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               password2:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos o usuario ya existe
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *       401:
 *         description: Credenciales inválidas
 */

/**
 * @swagger
 * /auth/signout:
 *   get:
 *     summary: Cerrar sesión del usuario
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */

/**
 * @swagger
 * /auth/confirmed-account/{token}:
 *   get:
 *     summary: Confirmar cuenta de usuario
 *     tags:
 *       - Autenticación
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de confirmación enviado por correo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cuenta confirmada exitosamente
 *       400:
 *         description: Token inválido o expirado
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Solicitar restablecimiento de contraseña
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo de restablecimiento enviado
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Establecer nueva contraseña
 *     tags:
 *       - Autenticación
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Token inválido o datos incorrectos
 */

router
  .route('/register')
  .post(
    gateRegister,
    authorizeAction('create', 'user'),
    upload.single('photoProfile'),
    validateRegisterInput,
    validateEmail,
    existsUserWithState,
    registerUser
  );

router.route('/confirmed-account/:token').get(confirmationAccount);
router.route('/reset-password').post(forgotPassword);
router.route('/reset-password/:token').post(newPassword);
router.route('/login').post(signIn);
router.route('/signout').get(authenticateToken, signout);

export default router;
