
import { NextResponse } from "next/server";
import { getUserAnnonces, UserAnnoncesSearch } from "../../../../lib/services/annoncesService";
import { getUserFromCookies } from "../../../../utiles/getUserFomCookies";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const user = await getUserFromCookies();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp: UserAnnoncesSearch = {
    page: searchParams.get("page") || undefined,
    typeAnnonceId: searchParams.get("typeAnnonceId") || undefined,
    categorieId: searchParams.get("categorieId") || undefined,
    subCategorieId: searchParams.get("subCategorieId") || undefined,
    price: searchParams.get("price") || undefined,
  };

  try {
    const data = await getUserAnnonces(sp, String(user.id));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user annonces:", error);
    return NextResponse.json({ error: "Failed to fetch user annonces" }, { status: 500 });
  }
}
