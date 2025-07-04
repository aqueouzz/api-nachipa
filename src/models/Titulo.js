import mongoose from 'mongoose';

const tituloSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, 'El nombre de la institución es requerido'],
      unique: [true, 'El nombre de la institución debe ser único'],
      trim: true,
      maxlength: [50, 'El nombre debe tener menos de 50'],
      lowercase: true,
    },
    name: {
      type: String,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [50, 'El nombre debe tener menos de 50'],
      required: [true, 'El nombre es requerido'],
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [
        250,
        'El campo descripcion no puede tener más de 250 caracteres',
      ],
      trim: true,
      required: [true, 'La descripción es requerida'],
    },
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

export default mongoose.model('Titulo', tituloSchema);
