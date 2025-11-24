// app/.../route.js  (use the same path you provided)
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { getDb } from "../../../../../../../lib/mongodb"; // your existing import
import { Roles } from "../../../../../../../DATA/roles";

const CHINGUI_KEY = process.env.CHINGUISOFT_VALIDATION_KEY;
const CHINGUI_TOKEN = process.env.CHINGUISOFT_VALIDATION_TOKEN;

// helper: validate phone according to Chinguisoft rules: starts with 2/3/4 and 8 digits
function isValidChinguPhone(p : string): boolean {
  return /^[234]\d{7}$/.test(p);
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // 1) Read / validate body
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const contact = String(body.contact ?? "").trim();
    const samsar = body.samsar; // must be boolean

    console.log("Register body:", { email, password, contact, samsar });
    if (!email || !password || !contact || typeof samsar !== "boolean") {
      return NextResponse.json(
        { error: "email, password, contact et samsar (boolean) sont requis" },
        { status: 400 }
      );
    }

    // validate email & password
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "email invalide" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "password trop court" }, { status: 400 });
    }

    // validate phone format for Chinguisoft
    if (!isValidChinguPhone(contact)) {
      return NextResponse.json(
        { error: "contact invalide — doit commencer par 2,3 ou 4 et contenir 8 chiffres" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 2) Unique email
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // 3) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) Email verification token (unchanged)
    const verifyToken = crypto.randomUUID();
    const verifyTokenExpires = new Date(Date.now() + 30 * 60 * 1000);

    // 5) User document
    const userDoc = {
      email,
      samsar,
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
    // tokenContact stays but we'll replace it with actual OTP from Chinguisoft
    const tokenContact = crypto.randomUUID();
    const contactDoc = {
      userId: insertedId.toString(),
      contact,
      createdAt: new Date(),
      isActive: false,
      isVerified: false,
      verifyCode: tokenContact,       // temporary placeholder — will be updated
      verifyTokenExpires: null,       // will set after sending OTP
      verifyAttempts: 0,              // track attempts if needed
    };

    const contactInsert = await db.collection("contacts").insertOne(contactDoc);

    // --------------------
    // 8) Send OTP via Chinguisoft and store in the contact document
    // --------------------

    if (!CHINGUI_KEY || !CHINGUI_TOKEN) {
      console.error("Chinguisoft env vars not set");
      // Do not fail registration: return success but indicate OTP send failed.
      return NextResponse.json(
        {
          message: "User registered but OTP could not be sent (SMS credentials missing).",
          user: {
            id: insertedId.toString(),
            email,
            roleName: userDoc.roleName,
            emailVerified: userDoc.emailVerified,
            samsar,
          },
        },
        { status: 201 }
      );
    }

    try {
      const chinguUrl = `https://chinguisoft.com/api/sms/validation/${encodeURIComponent(CHINGUI_KEY)}`;
      // default language 'fr' — change to 'ar' if you want Arabic SMS
      const payload = { phone: contact, lang: "fr" };

      const resp = await fetch(chinguUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Validation-token": CHINGUI_TOKEN,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        console.error("Chinguisoft error sending OTP:", resp.status, errText);
        // Option: you can roll back user/contact insertion on failure.
        // For now: return success for user creation but indicate OTP failure.
        return NextResponse.json(
          {
            message: "User registered but OTP could not be sent (SMS provider error).",
            user: {
              id: insertedId.toString(),
              email,
              roleName: userDoc.roleName,
              emailVerified: userDoc.emailVerified,
              samsar,
            },
          },
          { status: 201 }
        );
      }

      const chinguJson = await resp.json();
      // chinguisoft returns: { code: 654321, balance: 95 } per docs
      const otpCode = String(chinguJson.code ?? "");
      const balance = chinguJson.balance;

      // compute expiry: 5 minutes
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // update the contact document with the real OTP and expiry
      await db.collection("contacts").updateOne(
        { _id: contactInsert.insertedId },
        {
          $set: {
            verifyCode: otpCode,
            verifyTokenExpires: expiresAt,
            verifyAttempts: 0,
          },
        }
      );

      // optional: log balance somewhere or send to admin if low
      console.log("Chinguisoft OTP sent, balance:", balance);

      // 9) Response (do NOT return OTP code to client)
      return NextResponse.json(
        {
          message: "User registered successfully. OTP sent to phone.",
          user: {
            id: insertedId.toString(),
            email,
            roleName: userDoc.roleName,
            emailVerified: userDoc.emailVerified,
            samsar,
          },
        },
        { status: 201 }
      );
    } catch (smsErr) {
      console.error("Error sending OTP:", smsErr);
      // On error, we still succeed registration but inform client that SMS failed
      return NextResponse.json(
        {
          message: "User registered but OTP sending failed (internal).",
          user: {
            id: insertedId.toString(),
            email,
            roleName: userDoc.roleName,
            emailVerified: userDoc.emailVerified,
            samsar,
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating user:", error);
    if ((error as any)?.code === 11000 || (error as any)?.codeName === "DuplicateKey") {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
