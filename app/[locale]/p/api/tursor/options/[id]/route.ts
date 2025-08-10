import { NextRequest, NextResponse } from "next/server";
import { turso } from "../tursoClient";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Champs obligatoires manquants", { status: 400 });
    }

    const result = await turso.execute("SELECT * FROM options WHERE id = ?", [
      id,
    ]);
    const option = result.rows[0] || null;

    return NextResponse.json(option, { status: 200 });
  } catch (error) {
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
