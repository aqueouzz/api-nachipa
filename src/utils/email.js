import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
  const { email, firstName, token } = data;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "fsoto@nachipa-w.com", // Cambia por tu email
      pass: "nolo iwzh qczd dqnu", // Cambia por tu contraseña o usa una App Password
    },
  });

  //Informacion email
  // TODO: Modificar diseño de email
  await transporter.sendMail({
    from: "Notificaciones de cuenta 👌 <no-responder@nachipa-w.com",
    to: email,
    subject: "Confirma tu cuenta email 💻",
    text: "Comprueba tu cuenta",
    replyTo: "no-responder@nachipa-w.com",
    html: `
                Hola : <h3> ${firstName.toUpperCase()} </h3> Comprueba tu cuenta en Inventory 😏</p>
                    <p>Tu cuenta ya esta casi lista , solo debes comprobarla en el siguiente link</p>
                    <a href='http://localhost:4500/api/v1/auth/confirmed-account/${token}'>comprobar cuenta</a>
        
                    <p>Si tu no creaste esta cuenta , puedes ignorar el mensaje</p>
            `,
  });
};

export const resetPassword = async (data) => {
  const { email, firstName, token } = data;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "fsoto@nachipa-w.com", // Cambia por tu email
      pass: "nolo iwzh qczd dqnu", // Cambia por tu contraseña o usa una App Password
    },
  });

  //Informacion email

  await transporter.sendMail({
    from: "Recupera tu clave 🔑 <no-responder@nachipa-w.com",
    to: email,
    subject: "Confirma tu cuenta email 💻",
    text: "Comprueba tu cuenta",
    replyTo: "no-responder@nachipa-w.com",
    html: `
    <p>Hola : ${firstName} has solicitado reestablecer tu password</p>
            <p>Sigue el siguiente enlace para generar un nuevo password : </p>
            <a href='http://localhost:3500/api/v1/auth/reset-password/${token}'>Reestablecer clave</a>

            <p>Si tu no solicitaste este meail puedes ignorar el mensaje</p>
    
    `,
  });
};
