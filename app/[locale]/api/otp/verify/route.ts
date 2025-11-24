// app/api/verify-otp/route.js
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../lib/mongodb"; // adjust relative path to your structure
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
