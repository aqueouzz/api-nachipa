import nodemailer from 'nodemailer';
import dns from 'dns/promises';

export const emailRegister = async (data) => {
  const { email, firstName, token } = data;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fsoto@nachipa-w.com', // Cambia por tu email
      pass: 'nolo iwzh qczd dqnu', // Cambia por tu contraseña o usa una App Password
    },
  });

  //Informacion email
  // TODO: Modificar diseño de email
  await transporter.sendMail({
    from: 'Notificaciones de cuenta 👌 <no-responder@nachipa-w.com',
    to: email,
    subject: 'Confirma tu cuenta email 💻',
    text: 'Comprueba tu cuenta',
    replyTo: 'no-responder@nachipa-w.com',
    html: `
                <body
                  style="
                    text-align: center;
                    font-size: 20px;
                  "
                    >
                    <h2>Francisco Soto</h2>

                    <p>
                      ¡Estás un paso mas cerca! <br />
                      Tu cuenta ya esta casi lista , solo debes comprobarla en el siguiente link
                    </p>
                    <div style="margin: 40px">
                      <a
                        style="
                          text-decoration: none;
                          border-radius: 50px;
                          padding: 20px;
                          background: #007aff;
                          color: white;
                          font-size: 1.2rem;
                        "
                        href="http://localhost:4500/api-nachipa/v1/auth/confirmed-account/${token}"
                        >Verifica cuenta</a
                      >
                    </div>

                    <p>Si tu no creaste esta cuenta , puedes ignorar el mensaje.</p>
                  </body>
            `,
  });
};

export const resetPassword = async (data) => {
  const { email, firstName, token } = data;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fsoto@nachipa-w.com', // Cambia por tu email
      pass: 'nolo iwzh qczd dqnu', // Cambia por tu contraseña o usa una App Password
    },
  });

  //Informacion email

  await transporter.sendMail({
    from: 'Recupera tu clave 🔑 <no-responder@nachipa-w.com',
    to: email,
    subject: 'Confirma tu cuenta email 💻',
    text: 'Comprueba tu cuenta',
    replyTo: 'no-responder@nachipa-w.com',
    html: `
    <p>Hola : ${firstName} has solicitado reestablecer tu password</p>
            <p>Sigue el siguiente enlace para generar un nuevo password : </p>
            <a href='http://localhost:4500/api-nachipa/v1/auth/reset-password/${token}'>Reestablecer clave</a>

            <p>Si tu no solicitaste este meail puedes ignorar el mensaje</p>
    
    `,
  });
};

export const isDomainValid = async (email) => {
  const domain = email.split('@')[1];
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch (e) {
    return false;
  }
};
