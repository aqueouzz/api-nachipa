import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema(
  {
    ubicationID: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Se necesita la ID de ubicacion'],
    },
    name: {
      type: String,
      required: [true, 'Se necesita ingresar el nombre'],
      maxLength: [40, 'El maximo de caracteres son 40'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    state: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Area', areaSchema);
