// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Schema, Types } = mongoose;

const userSchema = new Schema(
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
      lowercase: true,
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
      required: [true, 'lastName es requerido... validacion desde el modelo'],
    },
    birthDate: { type: Date },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, 'email es requerido... validacion desde el modelo'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Ingresar correo valido',
      ],
    },

    direction: { type: String, trim: true },
    phone: { type: String, trim: true },

    // ❌ Antes: default: new ObjectId() → genera IDs inválidos para el primer user
    // ✅ Ahora: opcionales y por defecto null
    businessID: {
      type: Types.ObjectId,
      ref: 'Business',
      default: null,
      required: false,
    },
    ubicationID: {
      type: Types.ObjectId,
      ref: 'Ubication',
      default: null,
      required: false,
    },
    areaID: {
      type: Types.ObjectId,
      ref: 'Area',
      default: null,
      required: false,
    },

    // Estabas usando String + default ObjectId → mismatch
    professionalDegreeID: {
      type: Types.ObjectId,
      ref: 'Titulo',
      default: null,
      required: false,
    },

    rolID: { type: Types.ObjectId, ref: 'Rol', default: null, required: false },

    internalRol: {
      type: String,
      enum: ['superadmin', 'admin', 'user'],
      lowercase: true,
      default: 'user',
    },
    password: { type: String, minlength: 6, trim: true },
    state: { type: Boolean },

    accessAplications: {
      type: [String],
      enum: ['omi', 'equipment'],
      default: ['omi'],
    },
    token: { type: String },
    confirmed: { type: Boolean, default: false },
    photoProfile: { type: String },

    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    deletedBy: { type: Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// Normaliza campos vacíos a null (evita guardar "")
function nullIfEmpty(v) {
  return v === '' ? null : v;
}
[
  'businessID',
  'ubicationID',
  'areaID',
  'professionalDegreeID',
  'rolID',
].forEach((k) => {
  userSchema.path(k).set(nullIfEmpty);
});

// Hash password si cambia
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Validar password
userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Crear token (NO metas un businessID inválido)
userSchema.methods.createToken = function () {
  const payload = {
    id: this._id.toString(),
    email: this.email,
    role: this.internalRol,
  };

  if (this.businessID && Types.ObjectId.isValid(this.businessID)) {
    payload.businessID = this.businessID.toString();
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  this.token = token;
  return token;
};

export default mongoose.model('User', userSchema);
