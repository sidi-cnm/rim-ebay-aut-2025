
import { NextResponse } from "next/server";
import { getAnnonces, Search } from "../../../lib/services/annoncesService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const sp: Search = {
    page: searchParams.get("page") || undefined,
    typeAnnonceId: searchParams.get("typeAnnonceId") || undefined,
    categorieId: searchParams.get("categorieId") || undefined,
    subCategorieId: searchParams.get("subCategorieId") || undefined,
    price: searchParams.get("price") || undefined,
    wilayaId: searchParams.get("wilayaId") || undefined,
    moughataaId: searchParams.get("moughataaId") || undefined,
    issmar: searchParams.get("issmar") || undefined,
    directNegotiation: searchParams.get("directNegotiation") || undefined,
    mainChoice: searchParams.get("mainChoice") as Search["mainChoice"] || undefined,
    subChoice: searchParams.get("subChoice") as Search["subChoice"] || undefined,
    aiQuery: searchParams.get("aiQuery") || undefined,
  };

  try {
    const data = await getAnnonces(sp);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching annonces:", error);
    return NextResponse.json({ error: "Failed to fetch annonces" }, { status: 500 });
  }
}
