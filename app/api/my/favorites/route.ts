
import { NextResponse } from "next/server";
import { getFavoriteAnnonces } from "../../../../lib/services/annoncesService";
import { getUserFromCookies } from "../../../../utiles/getUserFomCookies";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || undefined;
  
  const user = await getUserFromCookies();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getFavoriteAnnonces({ page }, String(user.id));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching favorite annonces:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}
