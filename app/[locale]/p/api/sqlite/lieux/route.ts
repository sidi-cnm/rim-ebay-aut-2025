import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");
    const db = new Database("dbLieux.db");
    let rows;
    if (parentId === null) {
      // Si parentId n'est pas fourni, retourne les options de depth = 1
      rows = db.prepare("SELECT * FROM options WHERE depth = 1").all();
    } else {
      // Si parentId est fourni, retourne les options dont parentID = parentId
      rows = db
        .prepare("SELECT * FROM options WHERE parentID = ?")
        .all(parentId);
    }
    db.close();
    return NextResponse.json(rows);
  } catch (error) {
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
