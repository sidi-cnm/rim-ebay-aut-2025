// app/[locale]/page.tsx
import ListAnnoncesUI from "./ui/ListAnnoncesUI";
import { FormSearchUI } from "../../packages/ui/components/FormSearch/FormSearchUI";
import { getI18n } from "../../locales/server";
import { Annonce } from "../../packages/mytypes/types";
import { getDb } from "../../lib/mongodb";
import { getUserFromCookies } from "../../utiles/getUserFomCookies";
import { ObjectId } from "mongodb";

import SearchBar from "../../packages/ui/components/FormSearch/SearchBar";

type Params = { locale: string };
type Search = {
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
    console.log("Fetching AI search:", API_URL, queryText);
    
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

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<Search>;
}) {
  const { locale } = await params;
  const sp = (await searchParams) ?? {};
  const t = await getI18n();

  const currentPage = Number(sp.page) || 1;
  const itemsPerPage = 6;
  const skip = (currentPage - 1) * itemsPerPage;

  // ----- Query Mongo -----
  const query: Record<string, any> = { status: "active", isPublished: true };

  // --- 1. AI SEARCH FILTER ---
  if (sp.aiQuery && sp.aiQuery.trim().length > 0) {
    const ids = await fetchSimilarAnnonces(sp.aiQuery);
    if (ids.length > 0) {
      // Convert string IDs to ObjectId if necessary, or keep as string if your DB stores them as string
      // Looking at line 81: id: String(a._id ?? a.id), 
      // And line 131: _id: new ObjectId(user.id)
      // Usually _id is ObjectId. 
      // The API returns IDs that matched. 
      // We should check if they are valid ObjectIds.
      const objectIds = ids
        .filter((id) => ObjectId.isValid(id))
        .map((id) => new ObjectId(id));

      if (objectIds.length > 0) {
         query._id = { $in: objectIds };
      } else {
         // Search returned IDs but none were valid ObjectIds, or empty?
         // If AI found nothing useful, maybe force empty result?
         // query._id = { $in: [] }; // forcing no results
      }
    } else {
       // AI returned no results for the query.
       // We should probably force empty results if the user specifically asked for something
       // query._id = { $in: [] }; 
       // OR we can ignore it and show all? Usually search implies filtering.
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

  // if (sp.subChoice === "voitures") query.categorieName = { $regex: /^voitures$/i };
  // if (sp.subChoice === "maison") query.categorieName = { $regex: /^maisons$/i };

  if (sp.mainChoice) {
    // Appliquer le filtre uniquement si subChoice est aussi défini
    if (sp.subChoice === "voitures") {
      query.typeAnnonceName = sp.mainChoice; // location ou vente
      query.categorieName = "voitures";
    }
    if (sp.subChoice === "Maisons") {
      console.log("filtering maisons");
      query.typeAnnonceName = sp.mainChoice; // location ou vente
      query.categorieName = "Maisons";
    }
  }


  const db = await getDb();
  const coll = db.collection("annonces");

  const [rows, totalCount] = await Promise.all([
    coll.find(query).sort({ isSponsored: -1, updatedAt: -1 }).skip(skip).limit(itemsPerPage).toArray(),
    coll.countDocuments(query),
  ]);

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

  // ---- favoris utilisateur ----
  const user = await getUserFromCookies();
  let favoriteIds: string[] = [];
  if (user?.id) {
    const favs = await db.collection("favorites")
      .find({ userId: String(user.id) }, { projection: { annonceId: 1 } })
      .toArray();
    favoriteIds = favs.map(f => String(f.annonceId));
  }

  // ---- est-ce un samsar ? ----
  let isSamsar = false;
  if (user?.id) {
    const userIndb = await db.collection("users").findOne({ _id: new ObjectId(user.id) });
    if (userIndb?.samsar) isSamsar = true;
  }
  //sqlite api endpoints
  let lieuxEndpoint = `/${locale}/p/api/sqlite/lieux`;
  let optionsEndpoint = `/${locale}/p/api/sqlite/options`;
  // si on est en production alors on utilise les endpoints turso
  console.log("NODE_ENV:", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    // turso api endpoints
    optionsEndpoint = `/${locale}/p/api/tursor/options`;
    lieuxEndpoint = `/${locale}/p/api/tursor/lieux`;
  }


  const isRTL = locale.startsWith("ar");

  return (
    <main className="min-h-screen bg-gray-100">
      
      {/* Search Header Section */}
      <div className="bg-gray-100 px-4 py-4 md:py-6 mb-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
             {t("filter.title")}
          </h1>
          <div className="w-full max-w-2xl mt-6">
             <SearchBar 
               placeholder={locale === "ar" ? "مثال: عقار للإيجار في نواكشوط..." : "Ex: Appartement à louer à Nouakchott..."} 
               isRTL={isRTL} 
             />
          </div>
        </div>
      </div>


      {/* Mobile */}
      <div className="block md:hidden w-full px-2">
        <FormSearchUI
          lang={locale}
          typeAnnoncesEndpoint={optionsEndpoint}
          categoriesEndpoint={optionsEndpoint}
          subCategoriesEndpoint={optionsEndpoint}
          lieuxEndpoint={lieuxEndpoint}
          isSamsar={isSamsar}
          annonceTypeLabel={t("filter.type")}
          selectTypeLabel={t("filter.selectType")}
          selectCategoryLabel={t("filter.selectCategory")}
          selectSubCategoryLabel={t("filter.selectSubCategory")}
          formTitle={t("filter.title")}
          priceLabel={t("filter.price")}
          searchButtonLabel={t("filter.search")}
          mobile
        />
      </div>

      {/* Desktop + Mobile wrapper */}
      <div className="flex flex-col md:flex-row items-center md:items-start min-h-screen max-w-screen-2xl mx-auto gap-6 px-2 md:px-4 py-4 md:py-8">
        {/* Sidebar Desktop */}
        <aside className="hidden md:block w-80 xl:w-96 flex-shrink-0 self-start">
          <div className="sticky top-6 h-[calc(100vh-3rem)]">
            <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 overflow-y-auto">
              <FormSearchUI
                lang={locale}
                typeAnnoncesEndpoint={optionsEndpoint}
                categoriesEndpoint={optionsEndpoint}
                subCategoriesEndpoint={optionsEndpoint}
                lieuxEndpoint={lieuxEndpoint}
                isSamsar={isSamsar}
                annonceTypeLabel={t("filter.type")}
                selectTypeLabel={t("filter.selectType")}
                selectCategoryLabel={t("filter.selectCategory")}
                selectSubCategoryLabel={t("filter.selectSubCategory")}
                formTitle={t("filter.title")}
                priceLabel={t("filter.price")}
                searchButtonLabel={t("filter.search")}
              />
            </div>
          </div>
        </aside>

        {/* Section annonces */}
        <section className="w-full max-w-[720px] md:max-w-none md:flex-1 mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8 min-w-0">

          <ListAnnoncesUI
            title={t("nav.Annoce")}
            totalPages={totalPages}
            currentPage={currentPage}
            lang={locale}
            annonces={annonces}
            imageServiceUrl="https://picsum.photos"
            favoriteIds={favoriteIds}
            showSamsarToggle={isSamsar}
          />

        </section>
      </div>
    </main>
  );
}
