import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fsoto@nachipa-w.com', // Cambia por tu email
    pass: 'nolo iwzh qczd dqnu', // Cambia por tu contraseña o usa una App Password
  },
});

export default async function sendEmail({ to, subject, text }) {
  return transporter.sendMail({
    // from: process.env.EMAIL_USER,
    from: 'Notificaciones <no-responder@nachipa-w.com',
    bcc: 'fsoto@nachipa-w.com',
    to,
    subject,
    text,
  });
}
