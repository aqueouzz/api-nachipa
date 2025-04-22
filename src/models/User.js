import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    run: {
      type: String,
      maxlength: 10,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Ingresar correo valido",
      ],
      trim: true,
      unique: true,
    },
    direction: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    businessID: {
      type: String,
      ref: "Business",
    },
    ubicationID: {
      type: String,
      ref: "Ubication",
    },
    areaID: {
      type: String,
      ref: "Area",
    },
    professionalDegreeID: {
      type: String,
      ref: "ProfessionalDegree",
    },
    rol: {
      type: String,
      ref: "Rol",
    },
    internalRol: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      minlength: 6,
      trim: true,
    },
    state: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    accessAplications: {
      type: [String],
      enum: ["omi", "equipment"],
      default: ["omi"],
    },
    token: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    photoProfile: {
      type: String,
    },
  },
  { timestamps: true }
);

//Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Validate password
userSchema.methods.validatePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

//Create token
userSchema.methods.createToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  this.token = token;
  return token;
};

export default mongoose.model("User", userSchema);
