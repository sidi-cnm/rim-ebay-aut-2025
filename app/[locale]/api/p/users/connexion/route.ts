import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "../../../../../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 1️⃣ Chercher l'utilisateur actif
    const user = await db.collection("users").findOne({ email, isActive: true });
    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // 2️⃣ Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // 3️⃣ Expirer les anciennes sessions
    await db.collection("user_sessions").updateMany(
      { userId: user._id.toString(), isExpired: false },
      { $set: { isExpired: true } }
    );

    // 4️⃣ Créer un nouveau JWT
    const sessionToken = uuidv4();
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET non défini dans le fichier .env");
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        roleName: user.roleName,
        roleId: user.roleId,
        sessionToken: sessionToken,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5️⃣ Sauvegarder la nouvelle session
    const newSession = await db.collection("user_sessions").insertOne({
      userId: user._id.toString(),
      token: token,
      isExpired: false,
      lastAccessed: new Date(),
      createdAt: new Date(),
    });

    // 6️⃣ Mettre à jour le lastLogin de l'utilisateur
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // 7️⃣ Définir les cookies
    const cookieStore = await cookies();
    cookieStore.set({
      name: "jwt",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 jour
      path: "/",
    });

    cookieStore.set({
      name: "user",
      value: user._id.toString(),
      path: "/",
    });

    // 8️⃣ Retourner la réponse
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Connexion réussie",
      user: userWithoutPassword,
      sessionId: newSession.insertedId,
      token: token,
    });
  } catch (error: any) {
    console.error("Erreur connexion:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la connexion" },
      { status: error.message?.includes("incorrect") ? 401 : 500 }
    );
  }
}


//test@example.com
// motdepasse123
