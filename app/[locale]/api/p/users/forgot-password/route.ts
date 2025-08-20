import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getDb } from "../../../../../../lib/mongodb";
import { sendResetPasswordLink } from "../../../../../../lib/mailer"; // ← version Resend + fallback

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("users");
    const resets = db.collection("password_resets"); // nom de collection libre

    // 1) Chercher l'utilisateur
    const user = await users.findOne({ email });

    // 2) Si l'utilisateur existe → créer un token + enregistrement
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // +1h

      // (optionnel) invalider les anciens tokens non utilisés
      await resets.updateMany(
        { userId: String(user._id), used: { $ne: true } },
        { $set: { used: true, invalidatedAt: new Date() } }
      );

      await resets.insertOne({
        userId: String(user._id),
        email,
        token,
        used: false,
        createdAt: new Date(),
        expiresAt,
      });

      // 3) Envoyer l'email (Resend en prod, fallback local en dev)
      await sendResetPasswordLink(email, token);
    }

    // 4) Réponse générique (ne divulgue pas l’existence du compte)
    return NextResponse.json(
      { message: "Si un compte existe, vous recevrez un email de réinitialisation." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot-password error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
