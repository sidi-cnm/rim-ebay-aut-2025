
import { NextRequest, NextResponse } from "next/server";
import { turso } from "./tursoClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // optionnels: tag=wilaya|moughataa (sinon on dérive depuis depth/parentId)
    const tag = searchParams.get("tag") ?? undefined;

    // parentId => liste des moughataas de cette wilaya
    const parentIdRaw = searchParams.get("parentId");
    const parentId =
      parentIdRaw === null ? null : Number.isFinite(Number(parentIdRaw)) ? Number(parentIdRaw) : NaN;

    let rows;

    if (parentIdRaw === null) {
      // Pas de parentId fourni -> on renvoie les wilayas (depth=1)
      const sql =
        tag === "wilaya"
          ? "SELECT id, name, nameAr FROM options WHERE tag='wilaya' AND depth=1 ORDER BY priority, id"
          : "SELECT id, name, nameAr FROM options WHERE depth=1 ORDER BY priority, id";
      const res = await turso.execute(sql);
      rows = res.rows;
    } else {
      // parentId fourni -> moughataas de cette wilaya
      if (!Number.isFinite(parentId)) {
        return NextResponse.json({ ok: false, error: "parentId invalide" }, { status: 400 });
      }
      const sql =
        tag === "moughataa"
          ? "SELECT id, name, nameAr FROM options WHERE tag='moughataa' AND depth=2 AND parentID=? ORDER BY priority, id"
          : "SELECT id, name, nameAr FROM options WHERE depth=2 AND parentID=? ORDER BY priority, id";
      const res = await turso.execute({ sql, args: [parentId] });
      rows = res.rows;
    }

    return NextResponse.json({ ok: true, data: rows }, { status: 200 });
  } catch (error) {
    console.error("lieux list GET error:", error);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
