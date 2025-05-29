import mongoose from 'mongoose';

const userCourseSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pendiente', 'Completado'],
      default: 'Pendiente',
      required: true,
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
      default: 'Pendiente',
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('UserCourse', userCourseSchema, 'userCourses');
