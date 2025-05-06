import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
  {
    rut: {
      type: String,
      maxlength: 10,
      required: [true, 'Rut es requerido,desde modelo'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Nombre empresa es requerido,desde modelo'],
    },
    giro: {
      type: String,
      trim: true,
      required: [true, 'Giro empresa es requerido,desde modelo'],
    },
    commune: {
      type: String,
      required: [true, 'Comuna es requerido,desde modelo'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      required: [true, 'Ciudad es requerido,desde modelo'],
    },
    country: {
      type: String,
      required: [true, 'Pais es requerido,desde modelo'],
      trim: true,
    },
    phone: { type: String, trim: true },
    email: {
      type: String,
      required: [true, 'Correo es requerido,desde modelo'],
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
    },
    description: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Business', businessSchema);
