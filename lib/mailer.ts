// lib/mailer.ts
export const runtime = 'nodejs'; // utile si tu appelles ce module depuis une route

import nodemailer from "nodemailer";

/** Base URL (front) pour construire les liens */
function getBaseUrl() {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.SITE_BASE_URL ||
    "http://localhost:3000"
  );
}

/** Constantes d’envoi */
const RESEND_API_URL = "https://api.resend.com/emails";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "mailbox@resend.dev"; // OK pour tests Resend

/** Transport local (Mailhog/Maildev) */
const localTransporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
});

/** Normalise une erreur pour log lisible */
function normalizeError(e: any) {
  try {
    const basic = {
      name: e?.name,
      message: e?.message,
      statusCode: e?.statusCode,
    };
    const more = JSON.parse(JSON.stringify(e, Object.getOwnPropertyNames(e)));
    return { ...basic, ...more };
  } catch {
    return { message: String(e) };
  }
}

/** Envoi via Resend (HTTP fetch) */
async function sendWithResendFetch(to: string, subject: string, html: string) {
  try {
    if (!RESEND_API_KEY) {
      return {
        ok: false,
        provider: "resend",
        status: 401,
        error: "RESEND_API_KEY manquante",
        id: null as string | null,
      };
    }

    if (!EMAIL_FROM) {
      return {
        ok: false,
        provider: "resend",
        status: 400,
        error: "EMAIL_FROM manquante",
        id: null as string | null,
      };
    }

    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM, // doit être `onboarding@resend.dev` OU une adresse d’un domaine vérifié
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      let errBody: any;
      try {
        errBody = await res.json();
      } catch {
        errBody = await res.text();
      }
      return {
        ok: false,
        provider: "resend",
        status: res.status,
        error: typeof errBody === "string" ? errBody : JSON.stringify(errBody),
        id: null as string | null,
      };
    }

    const data: any = await res.json();
    // Resend REST renvoie typiquement { id: "..." }
    const id = data?.id ?? data?.data?.id ?? null;

    return { ok: true, provider: "resend", status: res.status, id, error: null as any };
  } catch (e: any) {
    return {
      ok: false,
      provider: "resend",
      status: 500,
      error: normalizeError(e),
      id: null as string | null,
    };
  }
}

/** Fallback local (Mailhog/Maildev) */
async function sendWithLocal(to: string, subject: string, html: string) {
  try {
    const info = await localTransporter.sendMail({
      from: `"Ton App" <${EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    return { ok: true, provider: "local", status: 200, id: info?.messageId || null, error: null as any };
  } catch (e: any) {
    return { ok: false, provider: "local", status: 500, id: null, error: normalizeError(e) };
  }
}

/** Public: email de vérification */
export async function sendVerificationEmail(to: string, token: string) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/ar/api/mail/verify?token=${token}`;
  const subject = "Confirme ton email";
  const html = `<p>Pour valider ton compte, clique <a href="${url}">ici</a>.</p>`;

  const primary = await sendWithResendFetch(to, subject, html);

  if (!primary.ok) {
    console.error("Resend failed:", primary);
    // Fallback local
    const fallback = await sendWithLocal(to, subject, html);
    if (!fallback.ok) console.error("Local mail failed:", fallback);
    return fallback.ok ? fallback : primary;
  }

  return primary;
}

/** Public: lien de réinitialisation */
export async function sendResetPasswordLink(to: string, token: string) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/fr/p/users/reset-password?token=${token}`;
  const subject = "Réinitialise ton mot de passe";
  const html = `<p>Pour réinitialiser ton mot de passe, clique <a href="${url}">ici</a>.</p>`;

  const primary = await sendWithResendFetch(to, subject, html);

  if (!primary.ok) {
    console.error("Resend failed:", primary);
    const fallback = await sendWithLocal(to, subject, html);
    if (!fallback.ok) console.error("Local mail failed:", fallback);
    return fallback.ok ? fallback : primary;
  }

  return primary;
}
















// // import nodemailer from "nodemailer";

// // // Choisit le transporteur selon l'env
// // const transporter = nodemailer.createTransport( 
// //      {
// //         host: "localhost",
// //         port: 1025,
// //         secure: false,
// //       }
    
// // );

// // export async function sendVerificationEmailLocal(to: string, token: string) {
// //   const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
// //   const url = `${baseUrl}/fr/api/mail/verify?token=${token}`;
// //  // console.log("Envoi de l'email de vérification à", to, "avec le lien", url);

// //   console.log( "avec le lien", url);
// //   await transporter.sendMail({
// //     from: '"Ton App" <no-reply@ton-domaine.com>',
// //     to,
// //     subject: "Confirme ton email",
// //     html: `<p>Pour valider ton compte, clique <a href="${url}">ici</a>.</p>`
// //   });
// // }

// // export async function sendResetPasswordLinkLocal(to: string, token: string) {
// //   const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
// //   const url = `${baseUrl}/fr/p/users/reset-password?token=${token}`;
// //  // console.log("Envoi de l'email de vérification à", to, "avec le lien", url);

// //   console.log( "avec le lien", url);
// //   await transporter.sendMail({
// //     from: '"Ton App" <no-reply@ton-domaine.com>',
// //     to,
// //     subject: "Confirme ton email",
// //     html: `<p>Pour valider ton compte, clique <a href="${url}">ici</a>.</p>`
// //   });
// // }










// export const runtime = 'nodejs';

// type SendResult =
//   | { ok: true; id: string; provider: 'resend' }
//   | { ok: false; provider: 'resend'; error: string; status?: number };

// function baseUrl() {
//   return process.env.NEXTAUTH_URL || process.env.SITE_BASE_URL || 'http://localhost:3000';
// }

// export async function sendVerificationEmailResend(to: string, token: string): Promise<SendResult> {
//   const RESEND_API_KEY = process.env.RESEND_API_KEY;
//   const EMAIL_FROM = process.env.EMAIL_FROM || 'mailbox@resend.dev';
//   const verifyUrl = `${baseUrl()}/fr/api/mail/verify?token=${encodeURIComponent(token)}`;

//   if (!RESEND_API_KEY) {
//     return { ok: false, provider: 'resend', error: 'Missing RESEND_API_KEY env' };
//   }

//   try {
//     const res = await fetch('https://api.resend.com/emails', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${RESEND_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         from: EMAIL_FROM,
//         to,
//         subject: 'Confirme ton email',
//         html: `<p>Pour valider ton compte, clique <a href="${verifyUrl}">ici</a>.</p>`,
//       }),
//     });

//     const text = await res.text(); // on lit le texte brut pour log clair
//     if (!res.ok) {
//       return {
//         ok: false,
//         provider: 'resend',
//         error: `HTTP ${res.status} ${res.statusText} - ${text}`,
//         status: res.status,
//       };
//     }

//     let json: any = {};
//     try { json = JSON.parse(text); } catch {}
//     const id = json?.id || 'unknown-id';

//     return { ok: true, id, provider: 'resend' };
//   } catch (e: any) {
//     return {
//       ok: false,
//       provider: 'resend',
//       error: `${e?.name || 'Error'}: ${e?.message || 'unknown error'}`,
//     };
//   }
// }

// export async function sendResetPasswordEmailResend(to: string, token: string): Promise<SendResult> {
//   const RESEND_API_KEY = process.env.RESEND_API_KEY;
//   const EMAIL_FROM = process.env.EMAIL_FROM || 'mailbox@resend.dev';
//   const resetUrl = `${baseUrl()}/fr/p/users/reset-password?token=${encodeURIComponent(token)}`;

//   if (!RESEND_API_KEY) {
//     return { ok: false, provider: 'resend', error: 'Missing RESEND_API_KEY env' };
//   }

//   try {
//     const res = await fetch('https://api.resend.com/emails', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${RESEND_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         from: EMAIL_FROM,
//         to,
//         subject: 'Réinitialise ton mot de passe',
//         html: `<p>Clique <a href="${resetUrl}">ici</a> pour réinitialiser ton mot de passe.</p>`,
//       }),
//     });

//     const text = await res.text();
//     if (!res.ok) {
//       return {
//         ok: false,
//         provider: 'resend',
//         error: `HTTP ${res.status} ${res.statusText} - ${text}`,
//         status: res.status,
//       };
//     }

//     let json: any = {};
//     try { json = JSON.parse(text); } catch {}
//     const id = json?.id || 'unknown-id';

//     return { ok: true, id, provider: 'resend' };
//   } catch (e: any) {
//     return {
//       ok: false,
//       provider: 'resend',
//       error: `${e?.name || 'Error'}: ${e?.message || 'unknown error'}`,
//     };
//   }
// }