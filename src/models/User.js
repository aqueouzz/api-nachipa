import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  run: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  direction: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
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
    required: true,
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
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
