// app/[locale]/api/p/users/reset-password/route.ts
import { NextResponse } from "next/server";
import { getDb } from "../../../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token et nouveau mot de passe requis." },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 1) Retrouver la demande de reset via le token
    const reset = await db.collection("password_resets").findOne({ token });
    if (!reset) {
      return NextResponse.json(
        { error: "Token invalide." },
        { status: 400 }
      );
    }

    // 2) Vérifier l’expiration
    if (reset.expiresAt && reset.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Token expiré." },
        { status: 400 }
      );
    }

    // 3) Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) Mettre à jour le mot de passe de l'utilisateur
    //    Dans ton schéma, userId est stocké comme string de l'ObjectId
    const userFilter = { _id: new ObjectId(String(reset.userId)) };

    const updateRes = await db.collection("users").updateOne(
      userFilter,
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    if (updateRes.matchedCount === 0) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // 5) Supprimer la demande de reset (évite la réutilisation)
    await db.collection("password_resets").deleteOne({ _id: reset._id });

    return NextResponse.json(
      { message: "Mot de passe réinitialisé avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset-password error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
