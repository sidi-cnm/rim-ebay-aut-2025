// app/[locale]/api/my/favorites/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../../lib/mongodb";
import { getUserFromCookies } from "../../../../../../utiles/getUserFomCookies";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();

    // Auth
    const user = await getUserFromCookies();
    const userId = String(user?.id ?? "");
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .collection("favorites")
      .find({ userId }, { projection: { _id: 0, annonceId: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      ok: true,
      data: rows.map(r => String(r.annonceId)),
      raw: rows, // si tu veux aussi les dates
    });
  } catch (e) {
    console.error("GET /my/favorites error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
