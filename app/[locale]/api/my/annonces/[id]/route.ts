import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../../lib/mongodb";
import { getUserFromCookies } from "../../../../../../utiles/getUserFomCookies";

// GET /[locale]/api/my/annonces/:id
export async function GET(_req: Request, ctx: any) {
  try {
    const { id } = ctx.params;
    const db = await getDb();

    const user = await getUserFromCookies();
    const userIdStr = String(user?.id ?? "");
    if (!userIdStr) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    let annonceId: ObjectId;
    try { annonceId = new ObjectId(id); }
    catch { return NextResponse.json({ error: "ID d'annonce invalide" }, { status: 400 }); }

    const doc = await db.collection("annonces").findOne({ _id: annonceId, userId: userIdStr });
    if (!doc) return NextResponse.json({ error: "Annonce introuvable" }, { status: 404 });

    const { _id, ...rest } = doc as any;
    return NextResponse.json({ id: _id.toString(), ...rest }, { status: 200 });
  } catch (err) {
    console.error("GET annonce error:", err);
    return NextResponse.json({ error: "Error getting annonce" }, { status: 500 });
  }
}

// PUT /[locale]/api/my/annonces/:id
// PUT /[locale]/api/my/annonces/:id
export async function PUT(req: Request, ctx: any) {
  try {
    const { id } = ctx.params;
    const db = await getDb();

    const user = await getUserFromCookies();
    const userIdStr = String(user?.id ?? "");
    if (!userIdStr) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    let annonceId: ObjectId;
    try { annonceId = new ObjectId(id); }
    catch { return NextResponse.json({ error: "ID d'annonce invalide" }, { status: 400 }); }

    const body = await req.json() as {
      typeAnnonceId?: string;
      categorieId?: string;
      subcategorieId?: string;
      description?: string;
      price?: number | null;
      lieuId?: string;          // wilaya
      moughataaId?: string;
      issmar?: boolean;
      directNegotiation?: boolean | null;
      rentalPeriod?: string | null;
      rentalPeriodAr?: string | null;
    };

    const norm = (v: unknown) =>
      typeof v === "string" && v.trim() !== "" ? v.trim() : null;

    const update: Record<string, any> = { updatedAt: new Date() };
    if (typeof body.typeAnnonceId === "string") update.typeAnnonceId = body.typeAnnonceId;
    if (typeof body.categorieId === "string") update.categorieId = body.categorieId;
    if (typeof body.subcategorieId === "string") update.subcategorieId = body.subcategorieId;
    if (typeof body.description === "string") update.description = body.description;
    if (typeof body.price === "number" || body.price === null) update.price = body.price ?? null;
    if ("lieuId" in body)        update.lieuId = norm(body.lieuId);
    if ("moughataaId" in body)   update.moughataaId = norm(body.moughataaId);
    if (typeof body.issmar === "boolean") update.issmar = body.issmar;

    if (typeof body.directNegotiation === "boolean" || body.directNegotiation === null || body.directNegotiation === undefined) {
      update.directNegotiation = body.directNegotiation ?? null;
    }

    if ("rentalPeriod" in body)  update.rentalPeriod = norm(body.rentalPeriod);
    if ("rentalPeriodAr" in body) update.rentalPeriodAr = norm(body.rentalPeriodAr);

    console.log("body: " ,body)

    const value = await db.collection("annonces").findOneAndUpdate(
      { _id: annonceId, userId: userIdStr },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!value) {
      return NextResponse.json({ error: "Annonce introuvable ou non autorisée" }, { status: 404 });
    }

    const { _id, ...rest } = value as any;
    return NextResponse.json({ id: _id.toString(), ...rest }, { status: 200 });
  } catch (err) {
    console.error("PUT annonce error:", err);
    return NextResponse.json({ error: "Error updating annonce" }, { status: 500 });
  }
}




// DELETE /[locale]/api/my/annonces/:id
export async function DELETE(_req: Request, ctx: any) {
  try {
    const { id } = ctx.params;
    const db = await getDb();

    const user = await getUserFromCookies();
    const userIdStr = String(user?.id ?? "");
    if (!userIdStr) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    let annonceId: ObjectId;
    try { annonceId = new ObjectId(id); }
    catch { return NextResponse.json({ error: "ID d'annonce invalide" }, { status: 400 }); }

    const res = await db.collection("annonces").updateOne(
      { _id: annonceId, userId: userIdStr },
      { $set: { status: "deleted", updatedAt: new Date() } }
    );

    if (res.matchedCount === 0) {
      return NextResponse.json({ error: "Annonce introuvable ou non autorisée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Annonce supprimée (soft delete)" }, { status: 200 });
  } catch (err) {
    console.error("DELETE annonce error:", err);
    return NextResponse.json({ error: "Error deleting annonce" }, { status: 500 });
  }
}
