
import { ObjectId } from "mongodb";
import { getDb } from "../mongodb";
import { getUserFromCookies } from "../../utiles/getUserFomCookies";
import { Annonce } from "../../packages/mytypes/types";

export type Search = {
  page?: string;
  typeAnnonceId?: string;
  categorieId?: string;
  subCategorieId?: string; // en DB: subcategorieId
  price?: string;
  wilayaId?: string;       // en DB: lieuId (wilaya)
  moughataaId?: string;    // en DB: moughataaId
  issmar?: string;
  directNegotiation?: string;
  mainChoice?: "Location" | "Vente";
  subChoice?: "voitures" | "Maisons";
  aiQuery?: string;
};

// --- Helper for Vector Search API ---
async function fetchSimilarAnnonces(queryText: string): Promise<string[]> {
  try {
    const API_URL = process.env.SMART_SEARCH_API_URL || "https://eddeyarrag-1.onrender.com/api/v1/query_annonces";
    
    // Using fetch with cache: 'no-store' to ensure fresh results or default behavior
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryText }),
    });

    if (!res.ok) {
      console.error("AI Search API error:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    // Expected format: { status: "success", results: [ { payload: { annonce_id: "..." } } ] }
    if (data.status === "success" && Array.isArray(data.results)) {
      // Map payload.annonce_id to string keys
      // The API returns 'annonce_id' in payload
      return data.results
        .map((r: any) => r.payload?.annonce_id)
        .filter((id: any) => Boolean(id));
    }
    return [];
  } catch (err) {
    console.error("AI Search network error:", err);
    return [];
  }
}

export async function getAnnonces(sp: Search) {
  const currentPage = Number(sp.page) || 1;
  const itemsPerPage = 16;
  const skip = (currentPage - 1) * itemsPerPage;

  // ----- Query Mongo -----
  const query: Record<string, any> = { status: "active", isPublished: true };

  // --- 1. AI SEARCH FILTER ---
  if (sp.aiQuery && sp.aiQuery.trim().length > 0) {
    const ids = await fetchSimilarAnnonces(sp.aiQuery);
    if (ids.length > 0) {
      // Convert string IDs to ObjectId if necessary
      const objectIds = ids
        .filter((id) => ObjectId.isValid(id))
        .map((id) => new ObjectId(id));

      if (objectIds.length > 0) {
        query._id = { $in: objectIds };
      } else {
        // AI returned IDs but none were valid ObjectIds
        query._id = { $in: [new ObjectId()] }; // impossible ID to ensure 0 results
      }
    } else {
       // AI returned no results for the query.
       // Let's force empty if query was present but no matches.
       query._id = { $in: [new ObjectId()] }; // impossible ID to ensure 0 results
    }
  }

  if (sp.typeAnnonceId) query.typeAnnonceId = sp.typeAnnonceId;
  if (sp.categorieId) query.categorieId = sp.categorieId;
  if (sp.subCategorieId) query.subcategorieId = sp.subCategorieId;
  if (sp.price && !isNaN(Number(sp.price))) query.price = Number(sp.price);

  if (sp.wilayaId) query.lieuId = sp.wilayaId;
  if (sp.moughataaId) query.moughataaId = sp.moughataaId;

  if (sp.issmar === "true") query.issmar = true;
  if (sp.directNegotiation === "true") query.directNegotiation = true;
  if (sp.directNegotiation === "false") query.directNegotiation = false;

  if (sp.mainChoice) {
    // Appliquer le filtre uniquement si subChoice est aussi défini
    if (sp.subChoice === "voitures") {
      query.typeAnnonceName = sp.mainChoice; // location ou vente
      query.categorieName = "voitures";
    }
    if (sp.subChoice === "Maisons") {
      query.typeAnnonceName = sp.mainChoice; // location ou vente
      query.categorieName = "Maisons";
    }
  }

  const db = await getDb();
  const coll = db.collection("annonces");

  // We need to fetch favorites & user info as well to build the full response if we want it to be identical
  // However, usually API returns just data.
  // The original page logic fetched:
  // 1. Annonces
  // 2. Favorites (if user logged in)
  // 3. User Samsar status (if user logged in)

  // We'll return everything so the page can just use this function.
  
  const [rows, totalCount] = await Promise.all([
    coll.find(query).sort({ isSponsored: -1, updatedAt: -1 }).skip(skip).limit(itemsPerPage).toArray(),
    coll.countDocuments(query),
  ]);

  // ---- favoris utilisateur ----
  const user = await getUserFromCookies();
  let favoriteIds: string[] = [];
  let isSamsar = false;

  if (user?.id) {
    const favs = await db.collection("favorites")
      .find({ userId: String(user.id) }, { projection: { annonceId: 1 } })
      .toArray();
    favoriteIds = favs.map(f => String(f.annonceId));

    const userIndb = await db.collection("users").findOne({ _id: new ObjectId(user.id) });
    if (userIndb?.samsar) isSamsar = true;
  }

  const annonces: Annonce[] = rows.map((a: any) => ({
    id: String(a._id ?? a.id),
    typeAnnonceId: a.typeAnnonceId,
    typeAnnonceid: a.typeAnnonceId,
    typeAnnonceName: a.typeAnnonceName ?? "",
    typeAnnonceNameAr: a.typeAnnonceNameAr ?? "",
    categorieId: a.categorieId,
    categorieName: a.categorieName ?? "",
    categorieNameAr: a.categorieNameAr ?? "",
    classificationAr: a.classificationAr ?? "",
    classificationFr: a.classificationFr ?? "",
    lieuId: a.lieuId,
    lieuid: a.lieuId,
    lieuStr: a.lieuStr ?? "",
    lieuStrAr: a.lieuStrAr ?? "",
    moughataaStr: a.moughataaStr ?? "",
    moughataaStrAr: a.moughataaStrAr ?? "",
    userId: a.userId,
    userid: a.userId,
    title: a.title,
    description: a.description,
    price: a.price != null ? Number(a.price) : undefined,
    contact: a.contact,
    haveImage: !!a.haveImage,
    firstImagePath: a.firstImagePath ? String(a.firstImagePath) : "",
    images: a.annonceImages ?? [],
    status: a.status,
    rentalPeriod: a.rentalPeriod ?? "",
    rentalPeriodAr: a.rentalPeriodAr ?? "",
    isSponsored: a.isSponsored,
    isFavorite: Boolean(a.isFavorite ?? false),
    isPriceHidden: Boolean(a.isPriceHidden ?? false),
    updatedAt: a.updatedAt ? new Date(a.updatedAt) : undefined,
    createdAt: a.createdAt ? new Date(a.createdAt) : undefined,
  }));

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  return {
    annonces,
    totalPages,
    currentPage,
    totalCount,
    isSamsar,
    favoriteIds
  };
}


// --- Refactored methods for other pages ---

export async function getFavoriteAnnonces(
  sp: { page?: string },
  userId: string
) {
  const currentPage = Number(sp.page) || 1;
  const itemsPerPage = 6;
  const skip = (currentPage - 1) * itemsPerPage;

  const db = await getDb();

  // 1) Récupérer les favoris de l’utilisateur (ids d’annonces)
  const favRows = await db
    .collection("favorites")
    .find({ userId: userId }, { projection: { annonceId: 1, _id: 0 } })
    .toArray();

  const allAnnonceIds = favRows
    .map((r: any) => r.annonceId)
    .filter(Boolean) as ObjectId[];

  const totalCount = allAnnonceIds.length;
  const pageIds = allAnnonceIds.slice(skip, skip + itemsPerPage);

  // 2) Charger les annonces correspondantes
  const annoncesRows = pageIds.length
    ? await db
        .collection("annonces")
        .find({ _id: { $in: pageIds } })
        .sort({ updatedAt: -1 })
        .toArray()
    : [];

  const annonces: Annonce[] = annoncesRows.map((a: any) => ({
    id: String(a._id ?? a.id),
    typeAnnonceId: a.typeAnnonceId,
    typeAnnonceid: a.typeAnnonceId,
    typeAnnonceName: a.type_annonce?.name ?? "",
    typeAnnonceNameAr: a.type_annonce?.nameAr ?? "",
    categorieId: a.categorieId,
    categorieid: a.categorieId,
    categorieName: a.categorie?.name ?? "",
    categorieNameAr: a.categorie?.nameAr ?? "",
    classificationAr: a.classificationAr ?? "",
    classificationFr: a.classificationFr ?? "",
    lieuId: a.lieuId,
    lieuid: a.lieuId,
    lieuStr: a.lieuStr ?? "",
    lieuStrAr: a.lieuStrAr ?? "",
    userId: a.userId,
    userid: a.userId,
    title: a.title,
    description: a.description,
    price: a.price != null ? Number(a.price) : undefined,
    contact: a.contact,
    haveImage: !!a.haveImage,
    firstImagePath: a.firstImagePath ? String(a.firstImagePath) : "",
    images: a.annonceImages ?? [],
    status: a.status,
    isFavorite: true, // ✅ forcément favori ici
    updatedAt: a.updatedAt ? new Date(a.updatedAt) : undefined,
    createdAt: a.createdAt ? new Date(a.createdAt) : undefined,
  }));

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  return { annonces, totalPages, currentPage, totalCount };
}

export type UserAnnoncesSearch = {
  page?: string;
  typeAnnonceId?: string;
  categorieId?: string;
  subCategorieId?: string;
  price?: string;
};

export async function getUserAnnonces(
  sp: UserAnnoncesSearch,
  userId: string
) {
  const currentPage = Number(sp.page) || 1;
  const itemsPerPage = 6;
  const skip = (currentPage - 1) * itemsPerPage;

  const query: Record<string, any> = { status: "active", userId: userId };
  
  if (sp.typeAnnonceId) query.typeAnnonceId = sp.typeAnnonceId;
  if (sp.categorieId) query.categorieId = sp.categorieId;
  if (sp.subCategorieId) query.subcategorieId = sp.subCategorieId;
  if (sp.price && !isNaN(Number(sp.price))) query.price = Number(sp.price);

  const db = await getDb();
  const coll = db.collection("annonces");

  const [rows, totalCount] = await Promise.all([
    coll.find(query).sort({ updatedAt: -1 }).skip(skip).limit(itemsPerPage).toArray(),
    coll.countDocuments(query),
  ]);

  const annonces: Annonce[] = rows.map((a: any) => ({
    id: String(a._id ?? a.id),
    typeAnnonceId: a.typeAnnonceId,
    typeAnnonceid: a.typeAnnonceId,
    typeAnnonceName: a.type_annonce?.name ?? "",
    typeAnnonceNameAr: a.type_annonce?.nameAr ?? "",
    categorieId: a.categorieId,
    categorieid: a.categorieId,
    categorieName: a.categorie?.name ?? "",
    categorieNameAr: a.categorie?.nameAr ?? "",
    lieuId: a.lieuId,
    lieuid: a.lieuId,
    lieuStr: a.lieuStr ?? "",
    lieuStrAr: a.lieuStrAr ?? "",
    userId: a.userId,
    userid: a.userId,
    classificationFr: a.classificationFr ?? "",
    classificationAr: a.classificationAr ?? "",
    title: a.title,
    description: a.description,
    price: a.price != null ? Number(a.price) : undefined,
    contact: a.contact,
    privateDescription: a.privateDescription,
    haveImage: !!a.haveImage,
    firstImagePath: a.firstImagePath ? String(a.firstImagePath) : undefined,
    images: a.annonceImages ?? [],
    status: a.status,
    updatedAt: a.updatedAt ? new Date(a.updatedAt) : undefined,
    createdAt: a.createdAt ? new Date(a.createdAt) : undefined,
  }));

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  return { annonces, totalPages, currentPage, totalCount };
}

export async function getUserStatus(userId: string) {
  const db = await getDb();
  let isSamsar = false;

  if (userId) {
     const userIndb = await db.collection("users").findOne({_id: new ObjectId(userId)});
     if(userIndb){
       isSamsar = userIndb.samsar;
     }
  }
  return { isSamsar };
}
