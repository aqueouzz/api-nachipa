import { mongoose } from 'mongoose';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    run: {
      type: String,
      maxlength: 10,
      trim: true,
      unique: true,
      required: [true, 'run es requerido... validacion desde el modelo'],
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'username es requerido... validacion desde el modelo'],
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, 'firstName es requerido... validacion desde el modelo'],
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
      required: [true, 'email es requerido... validacion desde el modelo'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Ingresar correo valido',
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      default: () => new mongoose.Types.ObjectId(),
      required: false,
    },
    ubicationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ubication',
      default: '681e0d4f63a6238dd4b1446e',
      required: false,
    },
    areaID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
      default: '681e0d4f63a6238dd4b1446e',
      required: false,
    },
    professionalDegreeID: {
      type: String,
      ref: 'Titulo',
      default: () => new mongoose.Types.ObjectId(),
      required: false,
    },
    rolID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rol',
      default: () => '681e0d4f63a6238dd4b1446e',
      required: false,
    },
    internalRol: {
      type: String,
      enum: ['superadmin', 'admin', 'user'],
      default: 'user',
    },
    password: {
      type: String,
      minlength: 6,
      trim: true,
    },
    state: {
      type: Boolean,
    },
    accessAplications: {
      type: [String],
      enum: ['omi', 'equipment'],
      default: ['omi'],
      required: [true, 'Aplicacion requerida... validacion desde el modelo'],
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
      required: false,
    },
  },
  { timestamps: true }
);

//Hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
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
  const token = jwt.sign(
    { id: this._id, role: this.internalRol },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  this.token = token;
  return token;
};

export default mongoose.model('User', userSchema);
