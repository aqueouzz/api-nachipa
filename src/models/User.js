import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  run: {
    type: String,
    required: [true, "Ingresar run"],
    trim: true,
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Ingresar username"],
    trim: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, "Ingresar nombres"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Ingresar apellidos"],
    trim: true,
  },
  birthDate: {
    type: Date,
    required: [true, "Ingresar fecha de nacimiento"],
  },
  email: {
    type: String,
    required: [true, "Ingresar email"],
    match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Ingresar correo valido",
      ],
    trim: true,
    unique: true,
  },
  direction: {
    type: String,
    required: [true, "Ingresar direccion"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Ingresar fono"],
    trim: true,
  },
  businessID: {
    type: mongoose.Types.ObjectId,
    ref: "Business",
  },
  ubicationID: {
    type: mongoose.Types.ObjectId,
    ref: "Ubication",
  },
  areaID: {
    type: mongoose.Types.ObjectId,
    ref: "Area",
  },
  professionalDegreeID: {
    type: mongoose.Types.ObjectId,
    ref: "ProfessionalDegree",
  },
  rol: {
    type: mongoose.Types.ObjectId,
    ref: "Rol",
  },
  internalRol: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Ingresar clave"],
    minlength: 6,
    trim: true,
  },
  state : {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  accessAplications : {
    type: [String],
    enum: ["omi", "equipment"],
    default: ["app1"],
  },
  token : {
    type: String,
  },
  confirmed : {
    type: Boolean,
    default: false,
  },


}, { timestamps: true });

export default mongoose.model("User", userSchema);
