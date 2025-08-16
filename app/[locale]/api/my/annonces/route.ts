// app/api/annonces/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../../lib/mongodb"; // vérifie que le fichier s'appelle bien mongodb.ts
import { ObjectId } from "mongodb";

const SiteBaseUrl = process.env.SITE_BASE_URL || "";
console.log("Site Base URL:", SiteBaseUrl);
let baseApi = "fr/p/api/tursor";
if (process.env.NEXT_PUBLIC_OPTIONS_API_MODE === "sqlite") {
  baseApi = "fr/p/api/sqlite";
}
console.log("Base API URL:", baseApi);

function getUserFromHeaders(request: NextRequest) {
  return {
    id: request.headers.get("x-user-id"),
    email: request.headers.get("x-user-email"),
    role: request.headers.get("x-user-role"),
  };
}

interface CreateAnnonceRequest {
  typeAnnonceId: string;
  subcategorieId: string;
  categorieId: string;
  lieuId: string;
  userId?: string;
  title: string;
  description: string;
  price?: number;
  contact?: string;
  haveImage?: boolean;
  firstImagePath?: string | null;
  images?: { imagePath: string }[];
  status: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const userInheaders = getUserFromHeaders(request);
  console.log("User from headers:", userInheaders);

  try {
    const db = await getDb();

    // --- Récup user depuis cookie (⚠️ ici cookies() est async dans ton env) ---
    const cookieStore = await cookies();                  // ← IMPORTANT: await
    const userCookie = cookieStore.get("user");
    const userIdStr = String(userCookie?.value ?? "");
    if (!userIdStr) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    // `_id` dans users est un ObjectId → conversion + lecture user
    let userDoc = null;
    try {
      userDoc = await db.collection("users").findOne({ _id: new ObjectId(userIdStr) });
    } catch {
      return NextResponse.json({ error: "ID utilisateur invalide" }, { status: 400 });
    }
    if (!userDoc) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // --- Récup contact prioritaire (vérifié/actif), sinon le plus récent ---
    let contact = "";
    const contactDoc =
      (await db.collection("contacts").findOne(
        { userId: userIdStr, isVerified: true, isActive: true },
        { projection: { contact: 1 } }
      )) ||
      (await db
        .collection("contacts")
        .find({ userId: userIdStr }, { projection: { contact: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(1)
        .next());

    if (contactDoc?.contact) contact = contactDoc.contact;

    // --- Lire & valider le body ---
    const data = (await request.json()) as CreateAnnonceRequest;

    const required: Array<keyof CreateAnnonceRequest> = [
      "typeAnnonceId",
      "subcategorieId",
      "categorieId",
      "lieuId",
      "title",
      "description",
      "status",
    ];
    const missing = required.find((k) => {
      const v = data[k];
      return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
    });
    if (missing) {
      return NextResponse.json({ error: `Champ requis manquant: ${missing}` }, { status: 400 });
    }

    // --- Construire le document annonce (IDs en String, conforme à ton validator) ---
    const now = new Date();
    const annonceDoc = {
      typeAnnonceId: String(data.typeAnnonceId),
      subcategorieId: String(data.subcategorieId),
      categorieId: String(data.categorieId),
      lieuId: String(data.lieuId),
      userId: userIdStr, // String
      title: data.title,
      description: data.description,
      price: typeof data.price === "number" ? data.price : null,
      contact: contact || data.contact || "",
      haveImage: Boolean(data.haveImage ?? false),
      firstImagePath: data.firstImagePath ?? null,
      status: data.status,
      isPublished: false,
      createdAt: now,
      updatedAt: now,
    };

    // --- Insert ---
    const result = await db.collection("annonces").insertOne(annonceDoc);

    // --- Réponse ---
    return NextResponse.json(
      { ...annonceDoc, id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'annonce:", error);
    return NextResponse.json(
      {
        error: "Error creating annonce",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
