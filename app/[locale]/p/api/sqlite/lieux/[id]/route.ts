import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Champs obligatoires manquants", { status: 400 });
    }
    const db = new Database("dbLieux.db");

    const option = db.prepare("SELECT * FROM options WHERE id = ?").get(id);
    db.close();
    return NextResponse.json(option, { status: 200 });
  } catch (error) {
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
