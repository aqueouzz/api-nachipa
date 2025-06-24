// cronWorker.js
import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import connectDB from '../config/db.js'; // Asegúrate de que tengas esto
import checkExpiringCourses from './checkExpiringCourses.js';
import checkExpiringBoardingCard from './checkExpiringBoardingCard.js';

// console.log(process.env);

// Conectar a la base de datos
await connectDB(
  'mongodb+srv://aqueouzco:G2O3y0Re6T3GVjNQ@cluster0.e74umyi.mongodb.net/profiles'
);

// console.log('🚀 Cron worker iniciado');

// La expresión cron '30 8 * * *' significa:

//     30 - en el minuto 30

//     8 - a las 8 horas (8 am)

//     * - cualquier día del mes

//     * - cualquier mes

//     * - cualquier día de la semana

cron.schedule('30 8 * * *', () => {
  setImmediate(async () => {
    console.time('⏱️ checkExpiringCourses');
    try {
      await checkExpiringCourses();
      await checkExpiringBoardingCard();
    } catch (err) {
      console.error('❌ Error al ejecutar checkExpiringCourses:', err.message);
    }
    console.timeEnd('⏱️ checkExpiringCourses');
  });
});
