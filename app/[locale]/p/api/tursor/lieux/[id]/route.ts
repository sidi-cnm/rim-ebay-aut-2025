
import { NextResponse } from "next/server";
import { turso } from "../tursoClient";

export async function GET(_req: Request, ctx: any) {
  try {
    const idRaw = ctx?.params?.id;
    const id = Number.isFinite(Number(idRaw)) ? Number(idRaw) : NaN;
    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, error: "id invalide" }, { status: 400 });
    }

    const res = await turso.execute({
      sql: "SELECT id, name, nameAr, priority, tag, depth, parentID FROM options WHERE id = ?",
      args: [id],
    });

    const option = res.rows?.[0] ?? null;
    if (!option) {
      return NextResponse.json({ ok: false, error: "Option introuvable" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: option }, { status: 200 });
  } catch (error) {
    console.error("lieu by id GET error:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
