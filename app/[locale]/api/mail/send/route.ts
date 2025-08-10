import { sendVerificationEmailLocal } from "../../../../../lib/mailer";

export async function GET(request: Request) {
   await sendVerificationEmailLocal("onboard@gmail.com", "test-token");
  return new Response("Mail API is not implemented yet", {
    status: 501,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}