import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const sessionId = (await cookies()).get("sessionId");
  (await cookies()).delete("jwt");
  (await cookies()).delete("user");
  return NextResponse.json({ message: "Déconnexion réussie" });
}
