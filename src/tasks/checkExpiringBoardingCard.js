//Import Util
import sendEmail from '../utils/sendEmail.js';
// Import Model
import User from '../models/User.js';

// Import depedencies
import days from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import 'dayjs/locale/es.js';

days.extend(utc);
days.extend(timezone);
days.locale('es');

// Function
const checkExpiringBoardingCard = async () => {
  const monthBeforeExpiryNotify =
    parseInt(process.env.MONTHS_BEFORE_EXPIRY_NOTIFY) || 1;

  // console.log(monthBeforeExpiryNotify);

  try {
    // Truncar a medianoche
    const today = new Date();
    // const today = new Date('2025-06-06T19:00:00.000Z'); // simula que es "mañana"

    today.setUTCHours(0, 0, 0, 0);

    const startNotifyDate = new Date(today);
    startNotifyDate.setMonth(today.getMonth() + monthBeforeExpiryNotify);

    // console.log(startNotifyDate);

    const users = await User.find({
      boardingCardValidUntil: { $lte: startNotifyDate, $gte: today },
      boardingCardValidUntilNotified: false,
    });

    for (const user of users) {
      // console.log(user.boardingCardValidUntil);

      // if (!user.email || !user.firstName) return;

      try {
        // 📧 Envio de Email notificando
        await sendEmail({
          to: user.email,
          subject: 'Tu libreta de embarco esta a punto de expirar!',
          text: `Hola ${user.firstName}, tu libreta de embarco  expira el ${days(user.boardingCardValidUntil).utc().format('DD [de] MMMM [de] YYYY')}. ¡No olvides renovarlo!`,
          // text: `Hola ${user.firstName}, tu boleto expiró el ${user.boardingCardValidUntil}. ¡No olvides renovarlo!`,
        });

        //Actualizar estado del campo de notificacion

        user.boardingCardValidUntilNotified = true;

        await user.save();
      } catch (error) {
        console.log(error);
      }
    }

    // Ceder al event loop para evitar un bloqueo
    await new Promise((res) => setTimeout(res, 10));
  } catch (error) {
    console.log(error);
  }
};

checkExpiringBoardingCard();

export default checkExpiringBoardingCard;
