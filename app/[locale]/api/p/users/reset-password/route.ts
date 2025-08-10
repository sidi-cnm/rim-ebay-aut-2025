import { NextResponse } from 'next/server';
import bcrypt from "bcrypt";
//import bcrypt from 'bcryptjs';
import prisma from '../../../../../../lib/prisma';
//import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    // Trouver la demande de réinitialisation correspondante
    const resetRequest = await prisma.passwordReset.findFirst({ where: { token } });

    if (!resetRequest || resetRequest.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token invalide ou expiré.' }, { status: 400 });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword =  await bcrypt.hash(password, 10); 
    // Mettre à jour le mot de passe de l'utilisateur
    await prisma.user.update({
      where: { id: resetRequest.userId },
      data: { password: hashedPassword },
    });

    // Supprimer la demande de réinitialisation pour éviter réutilisation
    await prisma.passwordReset.delete({ where: { id: resetRequest.id } });

    return NextResponse.json({ message: 'Mot de passe réinitialisé avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('Reset-password error:', error);
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 });
  }
}
