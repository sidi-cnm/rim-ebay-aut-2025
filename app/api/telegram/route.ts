// app/api/telegram/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log("TELEGRAM_BOT_TOKEN:", TELEGRAM_BOT_TOKEN);
    console.log("TELEGRAM_CHAT_ID:", TELEGRAM_CHAT_ID);
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json(
        { error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID" },
        { status: 500 }
      );
    }

    console.log("Sending message to Telegram...");


    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const { searchParams } = new URL(req.url);
    const message = searchParams.get("msg") || "⚠️ message vide";
    
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      }),
    });

    console.log("Telegram response status:", res.status);

    const data = await res.json();

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
