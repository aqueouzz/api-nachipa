import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { emailRegister, resetPassword } from "../utils/email.js";
import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from "../error/errorResponse.js";

//Create a new user
export const registerUser = async (req, res, next) => {
  const user = new User(req.body);

  const token = user.createToken();
  user.token = token;

  //Check file photo
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Please upload a photo" });
  }

  const photoUrl = `/uploads/${req.file.filename}`;
  user.photoProfile = photoUrl;

  await user.save();
  emailRegister({
    email: user.email,
    firstName: user.firstName,
    token: token,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "User created", user: user, token });
};

//Sign in account
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new UnauthenticatedError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Correo no es valido");
  }

  if (!user.confirmed) {
    throw new BadRequestError("No ha confirmado su cuenta");
  }

  const isPassword = await user.validatePassword(password);

  if (!isPassword) {
    throw new UnauthenticatedError("Clave incorrecta!");
  }

  const token = user.createToken();

  res.cookie("t", token, {
    expire: new Date() + 9999,
  });

  res.status(201).json({ user: user.firstName, token: token });
};

//Confimation account
export const confirmationAccount = async (req, res) => {
  const { token } = req.params;

  const userConfirm = await User.findOne({ token });

  if (!userConfirm) {
    throw new BadRequestError("Token no valido o expirado");
  }

  const { email } = userConfirm;
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError("No existe el usuario");
  }

  userConfirm.confirmed = true;
  userConfirm.token = "";

  await userConfirm.save();

  res
    .status(200)
    .json({ success: true, message: "Cuenta confirmada correctamente" });
};

//Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  //Comprobamos si el user existe
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError("El usuario no existe");
  }

  user.token = user.createToken();
  await user.save();

  //Enviamos el email
  resetPassword({
    email: user.email,
    firstName: user.firstName,
    token: user.token,
  });

  res.json({
    success: true,
    message: "Hemos enviado un email para reestablecer tu clave",
  });
};
//Reset password
export const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  if (user) {
    user.password = password;
    user.token = "";

    await user.save();
    res.json({ msg: "Usuario modificado correctamente" });
  } else {
    throw new BadRequestError("Token invalid");
  }
};

//Validacion de Token
export const requireToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ErrorResponse("Falta token de autorizacion");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    next(error);
  }
};

//Sign out account
export const signout = (req, res) => {
  console.log(res);
  res.clearCookie("t");
  res.json({
    message: "Signout success",
  });
};

