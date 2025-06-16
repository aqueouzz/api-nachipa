// cronWorker.js
import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import connectDB from '../config/db.js'; // Asegúrate de que tengas esto
import checkExpiringCourses from './checkExpiringCourses.js';

// Conectar a la base de datos
// await connectDB(
//   'mongodb+srv://aqueouzco:G2O3y0Re6T3GVjNQ@cluster0.e74umyi.mongodb.net/profiles'
// );

console.log('🚀 Cron worker iniciado');

cron.schedule('* * * * *', () => {
  setImmediate(async () => {
    console.time('⏱️ checkExpiringCourses');
    try {
      await checkExpiringCourses();
    } catch (err) {
      console.error('❌ Error al ejecutar checkExpiringCourses:', err.message);
    }
    console.timeEnd('⏱️ checkExpiringCourses');
  });
});
