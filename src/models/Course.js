import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const courseSchema = mongoose.Schema(
  {
    courseID: {
      type: String,
      required: [true, 'Campo ID del curso es requerido'],
      unique: true,
      default: () => nanoid(10),
    },
    name: {
      type: String,
      required: [true, 'Nombre del curso es requerido'],
      unique: true,
      trim: true,
      minLength: [2, 'El nombre del curso debe tener al menos 2 caracteres'],
      maxlength: [
        50,
        'El nombre del curso no puede superar los 100 caracteres',
      ],
    },
    description: {
      type: String,
      required: [true, 'Descripción del curso es requerida'],
      trim: true,
      maxlength: [
        250,
        'La descripción del curso no puede superar los 250 caracteres',
      ],
      trim: true,
    },
    dictoCourse: {
      type: String,
      required: [true, 'El dictador del curso es requerido'],
      trim: true,
      maxlength: [
        50,
        'El dictador del curso no puede superar los 50 caracteres',
      ],
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

export default mongoose.model('Course', courseSchema);
