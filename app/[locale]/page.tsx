// app/[locale]/page.tsx
import ListAnnoncesUI from "./ui/ListAnnoncesUI";
import { FormSearchUI } from "../../packages/ui/components/FormSearch/FormSearchUI";
import { getI18n } from "../../locales/server";
import { Annonce } from "../../packages/mytypes/types";
import { getDb } from "../../lib/mongodb";
import { getUserFromCookies } from "../../utiles/getUserFomCookies";
import { ObjectId } from "mongodb";

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
};

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

  if (sp.typeAnnonceId)   query.typeAnnonceId   = sp.typeAnnonceId;
  if (sp.categorieId)     query.categorieId     = sp.categorieId;
  if (sp.subCategorieId)  query.subcategorieId  = sp.subCategorieId;
  if (sp.price && !isNaN(Number(sp.price))) query.price = Number(sp.price);

  if (sp.wilayaId)       query.lieuId       = sp.wilayaId;
  if (sp.moughataaId)    query.moughataaId  = sp.moughataaId;

  if (sp.issmar === "true") query.issmar = true;
  if (sp.directNegotiation === "true")  query.directNegotiation = true;
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

  const lieuxEndpoint = `/${locale}/p/api/tursor/lieux`;

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Mobile */}
      <div className="block md:hidden w-full px-2 pt-4">
        <FormSearchUI
          lang={locale}
          typeAnnoncesEndpoint={`/${locale}/p/api/tursor/options`}
          categoriesEndpoint={`/${locale}/p/api/tursor/options`}
          subCategoriesEndpoint={`/${locale}/p/api/tursor/options`}
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
                typeAnnoncesEndpoint={`/${locale}/p/api/tursor/options`}
                categoriesEndpoint={`/${locale}/p/api/tursor/options`}
                subCategoriesEndpoint={`/${locale}/p/api/tursor/options`}
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
