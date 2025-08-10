import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

// /fr/p/api/sqlite/options/1
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log("id", id);
    if (!id) {
      return new NextResponse("Champs obligatoires manquants", { status: 400 });
    }
    const db = new Database("database.db");
    const option = db.prepare("SELECT * FROM options WHERE id = ?").get(id);
    db.close();
    console.log("option", option);

    return NextResponse.json(option, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
