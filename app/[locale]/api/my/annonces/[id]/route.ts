// app/api/annonces/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../../lib/mongodb"; // ajuste si ton fichier s'appelle autrement

function getUserFromHeaders(request: NextRequest) {
  return {
    id: request.headers.get("x-user-id"),
    email: request.headers.get("x-user-email"),
    role: request.headers.get("x-user-role"),
  };
}

/** GET /annonces/:id — lire une annonce appartenant à l'utilisateur courant */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDb();

    // user depuis cookie (Next 13/14: cookies() est async dans ce contexte)
    const cookieStore = await cookies();
    const userIdStr = String(cookieStore.get("user")?.value ?? "");
    if (!userIdStr) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // id d'annonce
    const { id } = params;
    let annonceId: ObjectId;
    try {
      annonceId = new ObjectId(id);
    } catch {
      return NextResponse.json({ error: "ID d'annonce invalide" }, { status: 400 });
    }

    // lire l'annonce qui appartient à l'utilisateur
    const annonce = await db.collection("annonces").findOne({
      _id: annonceId,
      userId: userIdStr, // ton schéma stocke userId en String
    });

    if (!annonce) {
      return NextResponse.json({ error: "Annonce introuvable" }, { status: 404 });
    }

    return NextResponse.json(
      { ...annonce, id: annonce._id.toString(), _id: undefined },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error getting annonce:", err);
    return NextResponse.json({ error: "Error getting annonce" }, { status: 500 });
  }
}

/** PUT /annonces/:id — mettre à jour une annonce appartenant à l'utilisateur courant */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDb();

    const cookieStore = await cookies();
    const userIdStr = String(cookieStore.get("user")?.value ?? "");
    if (!userIdStr) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = params;
    let annonceId: ObjectId;
    try {
      annonceId = new ObjectId(id);
    } catch {
      return NextResponse.json({ error: "ID d'annonce invalide" }, { status: 400 });
    }

    const data = await request.json() as {
      typeAnnonceId?: string;
      categorieId?: string;
      subcategorieId?: string;
      lieuId?: string;
      title?: string;
      description?: string;
      price?: number | null;
      contact?: string;
      haveImage?: boolean;
      firstImagePath?: string | null;
      status?: string;
      // userId?: string; // ⚠️ ignoré pour sécurité (on ne change pas le propriétaire)
    };

    // (optionnel) validation rapide de champs attendus
    const update: any = {
      updatedAt: new Date(),
    };
    if (typeof data.typeAnnonceId === "string") update.typeAnnonceId = String(data.typeAnnonceId);
    if (typeof data.categorieId === "string") update.categorieId = String(data.categorieId);
    if (typeof data.subcategorieId === "string") update.subcategorieId = String(data.subcategorieId);
    if (typeof data.lieuId === "string") update.lieuId = String(data.lieuId); // ← corrige le bug (ne pas mettre subcategorieId)
    if (typeof data.title === "string") update.title = data.title;
    if (typeof data.description === "string") update.description = data.description;
    if (typeof data.price === "number" || data.price === null) update.price = data.price ?? null;
    if (typeof data.contact === "string") update.contact = data.contact;
    if (typeof data.haveImage === "boolean") update.haveImage = data.haveImage;
    if (typeof data.firstImagePath === "string" || data.firstImagePath === null) update.firstImagePath = data.firstImagePath ?? null;
    if (typeof data.status === "string") update.status = data.status;

    // findOneAndUpdate pour renvoyer le doc mis à jour
    const result = await db.collection("annonces").findOneAndUpdate(
      { _id: annonceId, userId: userIdStr }, // contrôle de propriété
      { $set: update },
      { returnDocument: "after" },
    );

    if (!result?.value) {
      return NextResponse.json({ error: "Annonce introuvable ou non autorisée" }, { status: 404 });
    }

    const updated = result?.value;
    return NextResponse.json(
      { ...updated, id: updated._id.toString(), _id: undefined },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error updating annonce:", err);
    return NextResponse.json({ error: "Error updating annonce" }, { status: 500 });
  }
}

/** DELETE /annonces/:id — soft delete d’une annonce appartenant à l'utilisateur courant */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDb();

    // tu peux garder cette lecture si tu en as besoin pour des logs
    const userHdr = getUserFromHeaders(request);
    console.log("User from headers:", userHdr);

    const cookieStore = await cookies();
    const userIdStr = String(cookieStore.get("user")?.value ?? "");
    if (!userIdStr) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = params;
    let annonceId: ObjectId;
    try {
      annonceId = new ObjectId(id);
    } catch {
      return NextResponse.json({ error: "ID d'annonce invalide" }, { status: 400 });
    }

    const res = await db.collection("annonces").updateOne(
      { _id: annonceId, userId: userIdStr }, // contrôle de propriété
      { $set: { status: "deleted", updatedAt: new Date() } },
    );

    if (res.matchedCount === 0) {
      return NextResponse.json({ error: "Annonce introuvable ou non autorisée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Annonce supprimée (soft delete)" }, { status: 200 });
  } catch (err) {
    console.log("error delete:: ", err);
    return NextResponse.json({ error: "Error deleting annonce" }, { status: 500 });
  }
}
