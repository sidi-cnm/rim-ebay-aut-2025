import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../lib/mongodb"; // adjust relative path to your structure
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
// import { console } from "node:inspector";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const userId = String(body.userId ?? "").trim();
    const code = String(body.code ?? "").trim();

    if (!userId || !code) {
      return NextResponse.json({ error: "userId and code are required" }, { status: 400 });
    }

    const db = await getDb();

    // find the contact for this user
    const contactDoc = await db.collection("contacts").findOne({ userId: userId });

    if (!contactDoc) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // check if already verified
    if (contactDoc.isVerified) {
      return NextResponse.json({ error: "Contact already verified" }, { status: 400 });
    }

    // check attempts (optional brute force protection)
    const attempts = contactDoc.verifyAttempts ?? 0;
    const MAX_ATTEMPTS = 5;
    if (attempts >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: "Too many verification attempts" }, { status: 429 });
    }

    // check expiry
    const expiresAt = contactDoc.verifyTokenExpires ? new Date(contactDoc.verifyTokenExpires) : null;
    if (!expiresAt || isNaN(expiresAt.getTime()) || expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // check code
    if (String(contactDoc.verifyCode ?? "") !== code) {
      // increment attempts
      await db.collection("contacts").updateOne(
        { _id: contactDoc._id },
        { $inc: { verifyAttempts: 1 } }
      );
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    // success: mark contact verified & active, clear verifyCode/expiry, reset attempts
    await db.collection("contacts").updateOne(
      { _id: contactDoc._id },
      {
        $set: { isActive: true,
            isVerified: true, 
            verifyAttempts: 0,
            verifyTokenExpires: null 
        },
      }
    );

    // --- AUTO-LOGIN START ---
    // 1. Fetch user to get details for token and activate account
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    
    if (user) {
      console.log("Auto-login: User found", user._id);
      // Activate user account since phone is verified
      await db.collection("users").updateOne(
        { _id: user._id },
        { $set: { isActive: true, lastLogin: new Date() } }
      );

      // 2. Expire old sessions
      await db.collection("user_sessions").updateMany(
        { userId: user._id.toString(), isExpired: false },
        { $set: { isExpired: true } }
      );

      // 3. Create JWT
      const sessionToken = uuidv4();
      if (process.env.JWT_SECRET) {
        console.log("Auto-login: Creating JWT");
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

        // 4. Save Session
        await db.collection("user_sessions").insertOne({
          userId: user._id.toString(),
          token: token,
          isExpired: false,
          lastAccessed: new Date(),
          createdAt: new Date(),
        });

        // Mettre à jour le lastLogin de l'utilisateur
        await db.collection("users").updateOne(
          { _id: user._id },
          { $set: { lastLogin: new Date() } }
        );

        // 5. Set Cookies
        const cookieStore = await cookies();
        cookieStore.set({
          name: "jwt",
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 1 day
          path: "/",
        });

        cookieStore.set({
          name: "user",
          value: user._id.toString(),
          path: "/",
        });
        console.log("Auto-login: Cookies set");
      } else {
        console.error("JWT_SECRET is missing, cannot auto-login user");
      }
    } else {
        console.log("Auto-login: User NOT found for userId", userId);
    }
    // --- AUTO-LOGIN END ---

    console.log("Phone verified for userId:", userId);
    console.log("Reset verifyAttempts to 0 for contactId:", contactDoc._id);
    // ensure verifyAttempts is 0 (explicit update because we used $unset)
    // verifyAttempts already reset above
    
    return NextResponse.json({ message: "Phone verified successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
