import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
  {
    rut: {
      type: String,
      maxlength: 10,
      required: [true, 'Rut es requerido,desde modelo'],
      unique: [true, 'Rut empresa ya existe'],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: [20, 'Nombre empresa excede maximo de caracteres'],
      lowercase: true,
      unique: [true, 'Nombre empresa ya existe'],
      required: [true, 'Nombre empresa es requerido,desde modelo'],
    },
    giro: {
      type: String,
      trim: true,
      required: [true, 'Giro empresa es requerido,desde modelo'],
    },
    commune: {
      type: String,
      maxlength: [12, 'Comuna excede maximo de caracteres'],
      required: [true, 'Comuna es requerido,desde modelo'],
      trim: true,
    },
    city: {
      type: String,
      maxlength: 12,
      trim: true,
      required: [true, 'Ciudad es requerido,desde modelo'],
    },
    country: {
      type: String,
      required: [true, 'Pais es requerido,desde modelo'],
      trim: true,
      maxlength: 10,
    },
    phone: { type: String, trim: true, maxlength: 12 },
    email: {
      type: String,
      required: [true, 'Correo es requerido,desde modelo'],
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Ingresar correo valido',
      ],
      trim: true,
      unique: true,
    },
    nameContact: {
      type: String,
      required: [true, 'Nombre contacto es requerido,desde modelo'],
      trim: true,
      maxlength: 12,
    },
    description: { type: String, trim: true },
    state: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    deletedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    deletedAt: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model('Business', businessSchema);
