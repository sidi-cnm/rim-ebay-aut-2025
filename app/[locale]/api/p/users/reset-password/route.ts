// app/[locale]/api/p/users/reset-password/route.ts
import { NextResponse } from "next/server";
import { getDb } from "../../../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

// Force dynamic to prevent caching in production
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { contact, otp, password } = await req.json();

    if (!contact || !otp || !password) {
      return NextResponse.json(
        {
          error:
            "Numéro de téléphone, code OTP et nouveau mot de passe requis.",
        },
        { status: 400 }
      );
    }

    // Basic password validation
    if (password.length < 4) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 4 caractères." },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 1) Find the reset request by contact and OTP
    const reset = await db.collection("password_resets").findOne({
      contact,
      otpCode: otp,
      used: false,
    });

    if (!reset) {
      return NextResponse.json(
        { error: "Code OTP invalide." },
        { status: 400 }
      );
    }

    // 2) Check expiration
    if (reset.expiresAt && reset.expiresAt < new Date()) {
      // Mark as used to prevent reuse
      await db
        .collection("password_resets")
        .updateOne(
          { _id: reset._id },
          { $set: { used: true, expiredAt: new Date() } }
        );
      return NextResponse.json(
        { error: "Code OTP expiré. Veuillez demander un nouveau code." },
        { status: 400 }
      );
    }

    // 3) Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) Update user password
    const userFilter = { _id: new ObjectId(String(reset.userId)) };

    const updateRes = await db
      .collection("users")
      .updateOne(userFilter, {
        $set: { password: hashedPassword, updatedAt: new Date() },
      });

    if (updateRes.matchedCount === 0) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // 5) Mark the reset request as used
    await db
      .collection("password_resets")
      .updateOne(
        { _id: reset._id },
        { $set: { used: true, usedAt: new Date() } }
      );

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
