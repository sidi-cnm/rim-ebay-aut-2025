// // app/api/annonces/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { ObjectId } from "mongodb";
// import { getDb } from "../../../../../../lib/mongodb"; // ajuste si ton fichier s'appelle autrement
// import { getUserFromCookies } from "../../../../../../utiles/getUserFomCookies";

// function getUserFromHeaders(request: NextRequest) {
//   return {
//     id: request.headers.get("x-user-id"),
//     email: request.headers.get("x-user-email"),
//     role: request.headers.get("x-user-role"),
//   };
// }

// /** GET /annonces/:id — lire une annonce appartenant à l'utilisateur courant */
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const db = await getDb();

//     // user depuis cookie (Next 13/14: cookies() est async dans ce contexte)
//     // const cookieStore = await cookies();
//     const userData = await getUserFromCookies();
//     console.log("User data from cookies api side :", userData);
//     const userId = userData?.id ?? ""; 
//     const userIdStr = String(userId ?? "");
//     console.log("User ID from cookies:", userIdStr);
//     if (!userIdStr) {
//       return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
//     }

//     // id d'annonce
//     const { id } = params;
//     let annonceId: ObjectId;
//     try {
//       annonceId = new ObjectId(id);
//     } catch {
//       return NextResponse.json({ error: "ID d'annonce invalide" }, { status: 400 });
//     }

//     // lire l'annonce qui appartient à l'utilisateur
//     const annonce = await db.collection("annonces").findOne({
//       _id: annonceId,
//       userId: userIdStr, // ton schéma stocke userId en String
//     });

//     if (!annonce) {
//       return NextResponse.json({ error: "Annonce introuvable" }, { status: 404 });
//     }

//     return NextResponse.json(
//       { ...annonce, id: annonce._id.toString(), _id: undefined },
//       { status: 200 },
//     );
//   } catch (err) {
//     console.error("Error getting annonce:", err);
//     return NextResponse.json({ error: "Error getting annonce" }, { status: 500 });
//   }
// }

// /** PUT /annonces/:id — mettre à jour une annonce appartenant à l'utilisateur courant */
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const db = await getDb();

//     console.log("PUT params.id =", params.id);
//     const userData = await getUserFromCookies();
//     const userIdStr = String(userData?.id ?? "");
//     console.log("PUT cookie userId =", userIdStr);


// const only = await db.collection("annonces").findOne(
//   { _id: new ObjectId(params.id) },
//   { projection: { userId: 1 } }
// );
// console.log("Doc.userId in DB =", only?.userId, "type:", typeof only?.userId);

//     if (!userIdStr) {
//       return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
//     }

//     const { id } = params;
//     let annonceId: ObjectId;
//     try {
//       annonceId = new ObjectId(id);
//     } catch {
//       return NextResponse.json({ error: "ID d'annonce invalide" }, { status: 400 });
//     }

//     const data = await request.json() as {
//       typeAnnonceId?: string;
//       categorieId?: string;
//       subcategorieId?: string;
//       description?: string;
//       price?: number | null;
//       // userId?: string; // ⚠️ ignoré pour sécurité (on ne change pas le propriétaire)
//     };

//     // (optionnel) validation rapide de champs attendus
//     const update: any = {
//       updatedAt: new Date(),
//     };
//     if (typeof data.typeAnnonceId === "string") update.typeAnnonceId = String(data.typeAnnonceId);
//     if (typeof data.categorieId === "string") update.categorieId = String(data.categorieId);
//     if (typeof data.subcategorieId === "string") update.subcategorieId = String(data.subcategorieId);
//     if (typeof data.description === "string") update.description = data.description;
//     if (typeof data.price === "number" || data.price === null) update.price = data.price ?? null;
//     // findOneAndUpdate pour renvoyer le doc mis à jour
//     const result = await db.collection("annonces").findOneAndUpdate(
//       { _id: annonceId, userId: userIdStr }, // contrôle de propriété
//       { $set: update },
//       { returnDocument: "after" },
//     );

//     console.log("PUT result:", result);
//     if (!result) {
//       return NextResponse.json({ error: "Annonce introuvable ou non autorisée" }, { status: 404 });
//     }

//     console.log("PUT updated annonce:", result.value);

//     const updated = result;
//     return NextResponse.json(
//       { ...updated, id: updated._id.toString(), _id: undefined },
//       { status: 200 },
//     );
//   } catch (err) {
//     console.error("Error updating annonce:", err);
//     return NextResponse.json({ error: "Error updating annonce" }, { status: 500 });
//   }
// }

// /** DELETE /annonces/:id — soft delete d’une annonce appartenant à l'utilisateur courant */
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const db = await getDb();

//     // tu peux garder cette lecture si tu en as besoin pour des logs
   
//     const userData = await getUserFromCookies();
//     const userIdStr = String(userData?.id ?? "");
//     if (!userIdStr) {
//       return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
//     }

//     const { id } = params;
//     let annonceId: ObjectId;
//     try {
//       annonceId = new ObjectId(id);
//     } catch {
//       return NextResponse.json({ error: "ID d'annonce invalide" }, { status: 400 });
//     }

//     const res = await db.collection("annonces").updateOne(
//       { _id: annonceId, userId: userIdStr }, // contrôle de propriété
//       { $set: { status: "deleted", updatedAt: new Date() } },
//     );

//     if (res.matchedCount === 0) {
//       return NextResponse.json({ error: "Annonce introuvable ou non autorisée" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Annonce supprimée (soft delete)" }, { status: 200 });
//   } catch (err) {
//     console.log("error delete:: ", err);
//     return NextResponse.json({ error: "Error deleting annonce" }, { status: 500 });
//   }
// }












// app/[locale]/api/my/annonces/[id]/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../../lib/mongodb";
import { getUserFromCookies } from "../../../../../../utiles/getUserFomCookies";

// GET /[locale]/api/my/annonces/:id
export async function GET(_req: Request, ctx: any) {
  try {
    const { id } = ctx.params; // <-- pas d’annotation de type sur le 2e arg
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
    };

    const update: Record<string, any> = { updatedAt: new Date() };
    if (typeof body.typeAnnonceId === "string") update.typeAnnonceId = body.typeAnnonceId;
    if (typeof body.categorieId === "string") update.categorieId = body.categorieId;
    if (typeof body.subcategorieId === "string") update.subcategorieId = body.subcategorieId;
    if (typeof body.description === "string") update.description = body.description;
    if (typeof body.price === "number" || body.price === null) update.price = body.price ?? null;

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

