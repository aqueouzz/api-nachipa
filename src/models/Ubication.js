import mongoose from 'mongoose';

const businessSchema = mongoose.Schema(
  {
    businessID: {
      type: mongoose.Types.ObjectId,
      ref: 'Business',
    },
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      unique: [true, 'El nombre debe ser único'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [50, 'El nombre debe tener menos de 50'],
      //   lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
    },
    state: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Ubication', businessSchema);
