import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserCourse from '../models/UserCourse.js';
import sendEmail from '../utils/sendEmail.js';

dotenv.config();

const checkExpiringCourses = async () => {
  try {
    // Conexión si no está ya conectada
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_DEV);
    }

    const monthsBeforeExpiry = parseInt(process.env.MONTHS_BEFORE_EXPIRY) || 2;
    const daysToNotify = parseInt(process.env.DAYS_TO_NOTIFY) || 2;

    // Truncar a medianoche
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startNotifyDate = new Date(today);
    startNotifyDate.setMonth(today.getMonth() + monthsBeforeExpiry);

    // Buscar cursos que expiran dentro del rango
    const courses = await UserCourse.find({
      expirationDate: { $lte: startNotifyDate, $gte: today },
      expiryNotificationCount: { $lt: daysToNotify },
      $or: [
        { lastNotificationDate: { $lt: today } },
        { lastNotificationDate: { $exists: false } },
        { lastNotificationDate: null },
      ],
    }).populate(['userID', 'courseID']);
    console.log(`🔍 Cursos encontrados: ${courses.length}`);

    await Promise.all(
      courses.map(async (course) => {
        const user = course.userID;
        const courseInfo = course.courseID;

        if (!user?.email || !courseInfo?.name) return;

        try {
          await sendEmail({
            to: user.email,
            subject: 'Recordatorio: Tu curso está por expirar',
            text: `Hola ${user.firstName}, el curso "${courseInfo.name}" expira el ${new Date(course.expirationDate).toLocaleDateString()}.`,
          });

          // Actualizar campos
          course.expiryNotificationCount += 1;
          const todayMidnight = new Date();
          todayMidnight.setHours(0, 0, 0, 0);
          course.lastNotificationDate = todayMidnight;

          if (course.expiryNotificationCount === daysToNotify) {
            course.notifiedAboutExpiry = true;
          }

          await course.save();
          console.log(`📬 Notificación enviada a: ${user.email}`);
        } catch (error) {
          console.error(
            `❌ Error al notificar a ${user.email}:`,
            error.message
          );
        }
      })
    );

    console.log(`✅ Total de notificaciones enviadas: ${courses.length}`);
  } catch (err) {
    console.error('❌ Error en notificaciones:', err.message);
  }
};

export default checkExpiringCourses;

// Ejecutar si se llama directamente
if (process.argv[1] === new URL(import.meta.url).pathname) {
  checkExpiringCourses();
}
