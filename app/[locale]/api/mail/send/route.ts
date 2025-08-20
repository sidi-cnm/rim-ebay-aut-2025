import { sendVerificationEmail } from "../../../../../lib/mailer";

export async function GET(_request: Request) {
   await sendVerificationEmail("onboard@gmail.com", "test-token");
  return new Response("Mail API is not implemented yet", {
    status: 501,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}