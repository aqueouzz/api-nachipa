import mongoose from 'mongoose';

const rolShema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El campo nombre es obligatorio'],
      maxlength: [20, 'El campo nombre no puede tener más de 20 caracteres'],
      unique: [true, 'El campo nombre debe ser único'],
      trim: true,
      lowercase: true,
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
  { timestamps: true }
);

export default mongoose.model('Rol', rolShema);
