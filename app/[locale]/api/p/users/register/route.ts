import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { getDb } from "../../../../../../lib/mongodb"; // ← utilise ta connexion existante
import { Roles } from "../../../../../../DATA/roles";
// import { sendVerificationEmailLocal } from "../../../../../../lib/mailer";
import { sendVerificationEmail } from "../../../../../../lib/mailer";

export async function POST(request: NextRequest) {
  try {
    // 1) Lire/valider le body
    const { email, password, contact } = await request.json();
    if (!email || !password || !contact) {
      return NextResponse.json(
        { error: "Email and password and contact are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 2) Vérifier l'unicité de l'email (index unique requis côté DB)
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // 3) Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) Token de vérification (30 min)
    const verifyToken = crypto.randomUUID();
    const verifyTokenExpires = new Date(Date.now() + 30 * 60 * 1000);

    // 5) Document user (aligné avec tes validators)
    const userDoc = {
      email,
      password: hashedPassword,
      roleId: String(Roles[1].id),
      roleName: Roles[1].name,
      createdAt: new Date(),
      lastLogin: null,
      isActive: false,
      emailVerified: false,
      verifyToken,            // optionnel côté validator
      verifyTokenExpires,     // idem
    };

    // 6) Insert user
    const { insertedId } = await db.collection("users").insertOne(userDoc);

    // 7) Insert contact (dans ton schéma actuel, Contact.userId est un String)
    const tokenContact = crypto.randomUUID();
    await db.collection("contacts").insertOne({
      userId: insertedId.toString(),
      contact,
      createdAt: new Date(),
      isActive: false,
      isVerified: false,
      verifyCode: tokenContact,
      verifyTokenExpires: null,
    });

    // 8) Email de vérification
    const mailResult = await sendVerificationEmail(email, verifyToken);

    if (!mailResult.ok) {
      console.error("Email send failed (register):::", mailResult.error)
    }

    // 9) Réponse (ne pas renvoyer le hash/tokens)
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: insertedId.toString(),
          email,
          roleName: userDoc.roleName,
          emailVerified: userDoc.emailVerified,
        },
        mailStatus: mailResult, 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Doublon email (Mongo): 11000
    if (error?.code === 11000 || error?.codeName === "DuplicateKey") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
