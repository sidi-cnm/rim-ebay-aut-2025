import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
console.log("options route");
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");
    console.log("parentId", parentId);
    // const depth = searchParams.get("depth");

    const db = new Database("database.db");
    let rows;
    if (parentId === null) {
      rows = db.prepare("SELECT * FROM options WHERE depth = 1").all();
    }

    if (parentId !== null) {
      rows = db
        .prepare("SELECT * FROM options WHERE parentID = ?")
        .all(parentId);
    }

    db.close();

    return NextResponse.json(rows);
  } catch (error) {
    console.log(error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
