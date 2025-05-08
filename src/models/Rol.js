import mongoose from 'mongoose';

const rolShema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El campo name es obligatorio'],
      maxlength: [20, 'El campo name no puede tener más de 20 caracteres'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'El campo descripcion es obligatorio'],
      maxlength: [
        250,
        'El campo descripcion no puede tener más de 250 caracteres',
      ],
      trim: true,
    },
    state: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Rol', rolShema);
