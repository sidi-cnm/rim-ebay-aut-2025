//import "@std/dotenv/load";
import process from "node:process";
export async function sendTelegramMessage(message:string) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
 
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    }),
  });
}

//await sendTelegramMessage("Hello from Deno!");
// https://www.eddeyar.com/ar/p/annonces/details/68ce8e0604ecd062964a0dba
//await sendTelegramMessage("https://www.eddeyar.com/ar/p/annonces/details/68ce8e0604ecd062964a0dba");

