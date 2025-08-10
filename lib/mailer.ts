import nodemailer from "nodemailer";

// Choisit le transporteur selon l'env
const transporter = nodemailer.createTransport( 
     {
        host: "localhost",
        port: 1025,
        secure: false,
      }
    
);

export async function sendVerificationEmailLocal(to: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${baseUrl}/fr/api/mail/verify?token=${token}`;
 // console.log("Envoi de l'email de vérification à", to, "avec le lien", url);

  console.log( "avec le lien", url);
  await transporter.sendMail({
    from: '"Ton App" <no-reply@ton-domaine.com>',
    to,
    subject: "Confirme ton email",
    html: `<p>Pour valider ton compte, clique <a href="${url}">ici</a>.</p>`
  });
}

export async function sendResetPasswordLinkLocal(to: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${baseUrl}/fr/p/users/reset-password?token=${token}`;
 // console.log("Envoi de l'email de vérification à", to, "avec le lien", url);

  console.log( "avec le lien", url);
  await transporter.sendMail({
    from: '"Ton App" <no-reply@ton-domaine.com>',
    to,
    subject: "Confirme ton email",
    html: `<p>Pour valider ton compte, clique <a href="${url}">ici</a>.</p>`
  });
}
