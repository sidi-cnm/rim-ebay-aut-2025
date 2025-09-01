// app/[locale]/api/my/annonces/[annonceId]/favorite/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../../../lib/mongodb";
import { getUserFromCookies } from "../../../../../../../utiles/getUserFomCookies";

/**
 * PATCH /:locale/api/my/annonces/:annonceId/favorite
 * Body: { isFavorite: boolean }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const db = await getDb();

    // ---- Auth obligatoire ----
    const user = await getUserFromCookies();
    const userId = String(user?.id ?? "");
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // ---- Récup annonceId (params OU fallback via pathname) ----
    let annonceIdStr = params?.annonceId;

    if (!annonceIdStr) {
      const pathname = request.nextUrl.pathname; // ex: /fr/api/my/annonces/68b4.../favorite
      const parts = pathname.split("/").filter(Boolean);
      // parts: ["fr","api","my","annonces","68b4...","favorite"]
      const annoncesIdx = parts.findIndex((p) => p === "annonces");
      if (annoncesIdx >= 0 && parts.length > annoncesIdx + 1) {
        annonceIdStr = parts[annoncesIdx + 1];
      }
    }

    if (!annonceIdStr) {
      return NextResponse.json({ ok: false, error: "Missing annonceId" }, { status: 400 });
    }
    if (!ObjectId.isValid(annonceIdStr)) {
      return NextResponse.json({ ok: false, error: "Bad annonceId" }, { status: 400 });
    }
    const annonceId = new ObjectId(annonceIdStr);

    // ---- Vérifier que l’annonce existe (sécurisant) ----
    const exists = await db
      .collection("annonces")
      .findOne({ _id: annonceId }, { projection: { _id: 1 } });
    if (!exists) {
      return NextResponse.json({ ok: false, error: "Annonce not found" }, { status: 404 });
    }

    // ---- Lire body ----
    const body = await request.json().catch(() => null as any);
    const isFavorite = body?.isFavorite;
    if (typeof isFavorite !== "boolean") {
      return NextResponse.json({ ok: false, error: "isFavorite must be boolean" }, { status: 400 });
    }

    // ---- Collection favorites ----
    const favorites = db.collection("favorites");
    // Assure-toi d’avoir l’index unique (à faire une fois en script):
    // await favorites.createIndex({ userId: 1, annonceId: 1 }, { unique: true });

    if (isFavorite) {
      // Upsert: ajoute si pas présent
      await favorites.updateOne(
        { userId, annonceId },
        { $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    } else {
      await favorites.deleteOne({ userId, annonceId });
    }

    return NextResponse.json({ ok: true, annonceId: annonceIdStr, isFavorite });
  } catch (err) {
    console.error("PATCH favorite error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
