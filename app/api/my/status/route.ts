
import { NextResponse } from "next/server";
import { getUserStatus } from "../../../../lib/services/annoncesService";
import { getUserFromCookies } from "../../../../utiles/getUserFomCookies";

export async function GET(request: Request) {
  const user = await getUserFromCookies();
  if (!user?.id) {
    return NextResponse.json({ isSamsar: false });
  }

  try {
    const data = await getUserStatus(String(user.id));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user status:", error);
    return NextResponse.json({ error: "Failed to fetch user status" }, { status: 500 });
  }
}
