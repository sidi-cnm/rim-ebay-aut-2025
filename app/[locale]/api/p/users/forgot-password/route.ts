/*
File: app/api/auth/forgot-password/route.ts
Description: Simplified API route for handling password reset requests.
*/

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '../../../../../../lib/prisma';
import { sendResetPasswordLinkLocal, sendVerificationEmailLocal } from '../../../../../../lib/mailer';
// Import your database client, e.g., Prisma
//import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Rechercher l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Générer un token et enregistrer seulement si l'utilisateur existe
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token,
          expiresAt: expires,
        },
      });

      // TODO: Envoyer l'email avec Mailhog en local ou service tiers en prod
      // ex. await sendResetEmail(email, token);
       await sendResetPasswordLinkLocal(email,token)
    }

    // Réponse générique pour ne pas révéler l'existence du compte
    return NextResponse.json(
      { message: 'Si un compte existe, vous recevrez un email de réinitialisation.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot-password error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue.' },
      { status: 500 }
    );
  }
}
