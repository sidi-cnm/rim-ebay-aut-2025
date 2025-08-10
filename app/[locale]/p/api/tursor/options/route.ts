import { NextRequest, NextResponse } from "next/server";
import { turso } from "./tursoClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");
    const path = searchParams.get("path");
    let rows;
    if (parentId === null) {
      const result = await turso.execute(
        "SELECT * FROM options WHERE depth = 1",
      );
      rows = result.rows;
    }

    if (parentId !== null) {
      const result = await turso.execute(
        "SELECT * FROM options WHERE parentID = ?",
        [parentId],
      );
      rows = result.rows;
    }
    return NextResponse.json(rows);
  } catch (error) {
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
