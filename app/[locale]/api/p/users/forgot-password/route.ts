import { NextResponse } from "next/server";
import { getDb } from "../../../../../../lib/mongodb";

// Force dynamic to prevent caching in production
export const dynamic = "force-dynamic";

const CHINGUI_KEY = process.env.CHINGUISOFT_VALIDATION_KEY;
const CHINGUI_TOKEN = process.env.CHINGUISOFT_VALIDATION_TOKEN;

// helper: validate phone according to Chinguisoft rules: starts with 2/3/4 and 8 digits
function isValidChinguPhone(p: string): boolean {
  return /^[234]\d{7}$/.test(p);
}

export async function POST(request: Request) {
  try {
    const { contact } = await request.json();

    if (!contact) {
      return NextResponse.json(
        { error: "Numéro de téléphone requis" },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!isValidChinguPhone(contact)) {
      return NextResponse.json(
        {
          error:
            "Numéro invalide — doit commencer par 2, 3 ou 4 et contenir 8 chiffres",
        },
        { status: 400 }
      );
    }

    const db = await getDb();
    const contacts = db.collection("contacts");
    const resets = db.collection("password_resets");

    // 35) Find the contact (phone) in the contacts collection
    const contactDoc = await contacts.findOne({ contact, isVerified: true });

    if (!contactDoc || !contactDoc.userId) {
      return NextResponse.json(
        {
          error:
            "Ce numéro de téléphone n'est pas associé à un compte vérifié.",
        },
        { status: 404 }
      );
    }

    // 2) If contact exists and is verified → create OTP and send via SMS
    // Check rate limiting: max 3 requests per phone per hour
    const recentRequests = await resets.countDocuments({
      contact,
      createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) },
    });

    if (recentRequests >= 5) {
      return NextResponse.json(
        { error: "Trop de tentatives reçues. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    // Invalidate previous unused reset requests for this contact
    await resets.updateMany(
      { contact, used: { $ne: true } },
      { $set: { used: true, invalidatedAt: new Date() } }
    );

    // Check if Chinguisoft credentials are configured
    if (!CHINGUI_KEY || !CHINGUI_TOKEN) {
      console.error("Chinguisoft env vars not set for password reset");
      return NextResponse.json(
        { error: "Service SMS non configuré. Contactez l'administrateur." },
        { status: 500 }
      );
    }

    try {
      // Send OTP via Chinguisoft
      const chinguUrl = `https://chinguisoft.com/api/sms/validation/${encodeURIComponent(
        CHINGUI_KEY
      )}`;
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
        return NextResponse.json(
          { error: "Impossible d'envoyer le SMS. Réessayez plus tard." },
          { status: 500 }
        );
      }
      console.log("Chinguisoft response:", resp);

      const chinguJson = await resp.json();
      // Chinguisoft returns: { code: 654321, balance: 95 }
      const otpCode = String(chinguJson.code ?? "");
      const balance = chinguJson.balance;

      // Store OTP in password_resets collection
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      console.log("Password reset OTP sent, balance:", balance);

      await resets.insertOne({
        userId: contactDoc.userId,
        contact,
        token: otpCode, // Required by password_resets schema validator
        otpCode,
        used: false,
        createdAt: new Date(),
        expiresAt,
      });

      console.log("Password reset OTP sent, balance:", balance);
      console.log("Password reset OTP sent, otpCode:", otpCode);

      return NextResponse.json(
        { message: "Un SMS contenant le code de vérification a été envoyé." },
        { status: 200 }
      );
    } catch (smsErr) {
      console.error("Error sending password reset OTP:", smsErr);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi du SMS. Réessayez plus tard." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Forgot-password error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
