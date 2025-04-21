import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  run: {
    type: String,
    required: [true, "Ingresar run"],
    maxlength: 10,
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
 
  },
  lastName: {
    type: String,
    required: [true, "Ingresar apellidos"],
   
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
    default: ["omi"],
  },
  token : {
    type: String,
  },
  confirmed : {
    type: Boolean,
    default: false,
  },


}, { timestamps: true });

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
