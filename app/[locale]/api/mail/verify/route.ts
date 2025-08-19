// app/api/verify-email/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../lib/mongodb";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenFromEmail = url.searchParams.get("token");

  if (!tokenFromEmail) {
    return NextResponse.json({ error: "Token manquant" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const users = db.collection("users");
    const sessions = db.collection("userSessions"); // ← nom de collection pour les sessions

    // 1) Trouver l’utilisateur par le token (et optionnellement vérifier l’expiration)
    const now = new Date();
    const user = await users.findOne({
      verifyToken: tokenFromEmail,
      // Si tu gères une date d’expiration lors du register, décommente la ligne suivante :
      // verifyTokenExpires: { $gt: now },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 401 }
      );
    }

    // 2) Activer l’utilisateur + nettoyer le token de vérification
    await users.updateOne(
      { _id: new ObjectId(user._id) },
      {
        $set: {
          isActive: true,
          emailVerified: true,
          lastLogin: now,
        },
        $unset: {
          verifyToken: "",          // on supprime le token (optionnel mais recommandé)
          verifyTokenExpires: "",   // idem
        },
      }
    );

    const userIdStr = user._id.toString();

    // 3) Invalider les anciennes sessions actives
    await sessions.updateMany(
      { userId: userIdStr, isExpired: false },
      { $set: { isExpired: true } }
    );

    // 4) Créer un nouveau JWT + session
    const sessionToken = uuidv4();
    if (typeof process.env.JWT_SECRET !== "string") {
      throw new Error("JWT_SECRET non défini dans l'environnement");
    }

    const jwtToken = jwt.sign(
      {
        id: userIdStr,
        email: user.email,
        roleName: user.roleName,
        roleId: user.roleId,
        sessionToken, // l’UUID qu’on loge aussi en DB si tu veux
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const insertedSession = await sessions.insertOne({
      userId: userIdStr,     // on stocke en String (cohérent avec tes autres collections)
      token: jwtToken,
      isExpired: false,
      lastAccessed: now,
      createdAt: now,
      sessionToken,          // l’UUID si tu veux le retrouver vite
    });

    // 5) Poser les cookies
    const cookieStore = await cookies();

    cookieStore.set({
      name: "jwt",
      value: jwtToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 jour
      path: "/",
    });

    cookieStore.set({
      name: "user",
      value: userIdStr,
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    // 6) Redirection finale
    return NextResponse.redirect(new URL("/ar", request.url));
  } catch (error: any) {
    console.error("Erreur vérification email:", error);
    return NextResponse.json(
      {
        error: error?.message || "Erreur lors de la vérification",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
