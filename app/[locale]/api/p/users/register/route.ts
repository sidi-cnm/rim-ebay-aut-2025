import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { getDb } from "../../../../../../lib/mongodb"; // ← utilise ta connexion existante
import { Roles } from "../../../../../../DATA/roles";
// import { sendVerificationEmailLocal } from "../../../../../../lib/mailer";
import { sendVerificationEmail } from "../../../../../../lib/mailer";



export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // 1) Lire/valider le body
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const contact = String(body.contact ?? "").trim();
    const samsar = body.samsar; // doit être boolean

    console.log("Register body:", { email, password, contact, samsar });
    if (!email || !password || !contact || typeof samsar !== "boolean") {
      return NextResponse.json(
        { error: "email, password, contact et samsar (boolean) sont requis" },
        { status: 400 }
      );
    }

    // Optionnel: vérifier l’email et la longueur du mdp
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "email invalide" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "password trop court" }, { status: 400 });
    }

    const db = await getDb();

    // 2) Unicité email
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // 3) Hash mdp
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) Token vérif
    const verifyToken = crypto.randomUUID();
    const verifyTokenExpires = new Date(Date.now() + 30 * 60 * 1000);

    // 5) Doc user
    const userDoc = {
      email,
      samsar,                      // 👈 boolean strict
      password: hashedPassword,
      roleId: String(Roles[1].id),
      roleName: Roles[1].name,
      createdAt: new Date(),
      lastLogin: null,
      isActive: false,
      emailVerified: false,
      verifyToken,
      verifyTokenExpires,
    };

    // 6) Insert user
    const { insertedId } = await db.collection("users").insertOne(userDoc);

    // 7) Insert contact
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

    // 8) Email
    try {
      const mailResult = await sendVerificationEmail(email, verifyToken);
      if (!mailResult?.ok) {
        console.error("Email send failed (register):::", mailResult?.error);
      }
    } catch (e) {
      console.error("sendVerificationEmail crashed", e);
      // on n’échoue pas l’inscription pour un problème d’email
    }

    // 9) Réponse
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: insertedId.toString(),
          email,
          roleName: userDoc.roleName,
          emailVerified: userDoc.emailVerified,
          samsar, // renvoyer la valeur utile côté client
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error?.code === 11000 || error?.codeName === "DuplicateKey") {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
