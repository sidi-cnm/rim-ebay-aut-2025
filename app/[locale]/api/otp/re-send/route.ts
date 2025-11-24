// app/api/resend-otp/route.js
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../lib/mongodb";

const CHINGUI_KEY = process.env.CHINGUISOFT_VALIDATION_KEY;
const CHINGUI_TOKEN = process.env.CHINGUISOFT_VALIDATION_TOKEN;

// Lift Chinguisoft phone validation rule:
// phone must start with 2/3/4 and be exactly 8 digits
function isValidChinguPhone(p: string): boolean {
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

    const userId = String(body.userId ?? "").trim();
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const db = await getDb();

    // find contact linked to this user
    const contactDoc = await db.collection("contacts").findOne({ userId });

    if (!contactDoc) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // if already verified, no need to resend
    if (contactDoc.isVerified) {
      return NextResponse.json(
        { error: "Contact already verified" },
        { status: 400 }
      );
    }

    const phone = contactDoc.contact;

    if (!isValidChinguPhone(phone)) {
      return NextResponse.json(
        { error: "Phone format invalid for Chinguisoft" },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------------
    // RATE LIMITING (MongoDB based)
    // -------------------------------------------------------------------

    const now = new Date();
    const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute cooldown
    const MAX_RESENDS_PER_HOUR = 5;

    // track rate limiting info in contact doc
    const lastResendAt = contactDoc.lastResendAt
      ? new Date(contactDoc.lastResendAt)
      : null;
    const resendCount = contactDoc.resendCount ?? 0;

    // 1) cooldown check
    if (lastResendAt && now.getTime() - lastResendAt.getTime() < RESEND_COOLDOWN_MS) {
      return NextResponse.json(
        {
          error: "You must wait before requesting another OTP.",
          waitSeconds: Math.ceil(
            (RESEND_COOLDOWN_MS - (now.getTime() - lastResendAt.getTime())) / 1000
          ),
        },
        { status: 429 }
      );
    }

    // 2) hourly limit check
    if (resendCount >= MAX_RESENDS_PER_HOUR) {
      // Optionally reset after 1 hour:
      // if (now - new Date(contactDoc.resendResetAt) > 1h) reset; else block.
      return NextResponse.json(
        { error: "Too many OTP requests. Try again later." },
        { status: 429 }
      );
    }

    // -------------------------------------------------------------------
    // Send new OTP using Chinguisoft
    // -------------------------------------------------------------------

    if (!CHINGUI_KEY || !CHINGUI_TOKEN) {
      console.error("Chinguisoft credentials missing");
      return NextResponse.json(
        { error: "SMS provider credentials not set" },
        { status: 500 }
      );
    }

    try {
      const chinguUrl = `https://chinguisoft.com/api/sms/validation/${encodeURIComponent(
        CHINGUI_KEY
      )}`;

      const resp = await fetch(chinguUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Validation-token": CHINGUI_TOKEN,
        },
        body: JSON.stringify({ phone, lang: "fr" }), // change to "ar" if needed
      });

      if (!resp.ok) {
        const t = await resp.text().catch(() => "");
        console.error("Chinguisoft resend error", resp.status, t);
        return NextResponse.json(
          { error: "Failed to send OTP via provider" },
          { status: 500 }
        );
      }

      const json = await resp.json();
      const otpCode = String(json.code ?? "");
      const balance = json.balance;

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // update contact with new OTP + expiry, reset attempts
      await db.collection("contacts").updateOne(
        { _id: contactDoc._id },
        {
          $set: {
            verifyCode: otpCode,
            verifyTokenExpires: expiresAt,
            verifyAttempts: 0,
            lastResendAt: now,
          },
          $inc: { resendCount: 1 },
        }
      );

      console.log("Resend OTP OK. Balance:", balance);

      return NextResponse.json(
        { message: "OTP resent successfully" },
        { status: 200 }
      );
    } catch (e) {
      console.error("Resend OTP error:", e);
      return NextResponse.json(
        { error: "Internal error sending OTP" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Resend route error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
