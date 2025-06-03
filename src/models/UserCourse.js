import mongoose from 'mongoose';

const userCourseSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El campo user es obligatorio.'],
    },
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'El campo course es obligatorio.'],
    },
    status: {
      type: String,
      enum: ['Pendiente', 'Completado'],
      default: 'Completado',
      required: [true, 'El campo status es obligatorio.'],
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    validNavigationalGuard: {
      type: Boolean,
      default: false,
    },
    managementOrOperation: {
      type: String,
      enum: ['Gestion', 'Operacion', 'Apoyo'],
      default: 'Gestion',
    },
    boardingCardValidUntil: {
      // vigencia libreta de embarco del usuario en ese curso
      type: Date,
      required: false,
    },
    createdBY: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      default: '',
      maxlength: [250, 'Nota no debe exceder maximo de caracteres 250lim'],
    },
    notifiedAboutExpiry: {
      type: Boolean,
      default: false,
    },
    expiryNotificationCount: {
      type: Number,
      default: 0,
    },
    lastNotificationDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('UserCourse', userCourseSchema);
