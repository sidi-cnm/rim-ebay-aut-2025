import ListAnnoncesUI from "./ui/ListAnnoncesUI";
import { FormSearchUI } from "../../packages/ui/components/FormSearch/FormSearchUI";
import AnnoceTitle from "../../packages/ui/components/AnnoceTitle";
import { getI18n } from "../../locales/server";
import { LottieAnimation } from "../../packages/ui/components/LottieAnimation";
import { Annonce } from "../../packages/mytypes/types";
import { getDb } from "../../lib/mongodb"; // ⬅️ on utilise MongoDB

// Config API options (inchangé)
let modeOptionsApi: "sqlite" | "tursor" = "tursor";
if (!process.env.NEXT_PUBLIC_OPTIONS_API_MODE) modeOptionsApi = "sqlite";
if (
  process.env.NEXT_PUBLIC_OPTIONS_API_MODE &&
  process.env.NEXT_PUBLIC_OPTIONS_API_MODE !== "tursor"
) {
  modeOptionsApi = "sqlite";
}

const apiBase =
  modeOptionsApi === "sqlite" ? "/fr/p/api/sqlite" : "/fr/p/api/tursor";
const typeAnnoncesEndpoint = `${apiBase}/options`;
const categoriesEndpoint = `${apiBase}/options`;
const subCategoriesEndpoint = `${apiBase}/options`;

// ⬇️ params / searchParams sont des objets (pas des Promise)
export default async function Home({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: {
    page?: string;
    typeAnnonceId?: string;
    categorieId?: string;
    subCategorieId?: string; // NB: en DB c'est "subcategorieId" (ie)
    price?: string;
  };
}) {
  const t = await getI18n();

  // 1) Pagination & filtres
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 6;
  const skip = (currentPage - 1) * itemsPerPage;

  // 2) Construire la requête Mongo (équivalent "where")
  const query: Record<string, any> = { isPublished: false };
  if (searchParams?.typeAnnonceId)
    query.typeAnnonceId = searchParams.typeAnnonceId;
  if (searchParams?.categorieId) query.categorieId = searchParams.categorieId;
  if (searchParams?.subCategorieId)
    query.subcategorieId = searchParams.subCategorieId; // ⚠️ orthographe exacte
  if (searchParams?.price && !isNaN(Number(searchParams.price)))
    query.price = Number(searchParams.price);

  // 3) Lire depuis MongoDB
  const db = await getDb();
  const coll = db.collection("annonces");

  const [rows, totalCount] = await Promise.all([
    coll
      .find(query)
      .sort({ updatedAt: -1 }) // optionnel
      .skip(skip)
      .limit(itemsPerPage)
      .toArray(),
    coll.countDocuments(query),
  ]);

  // 4) Mapping vers ton type Annonce
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
    title: a.title,
    description: a.description,
    price: a.price != null ? Number(a.price) : undefined,
    contact: a.contact,

    haveImage: !!a.haveImage,
    firstImagePath: a.firstImagePath ? String(a.firstImagePath) : "",
    images: a.annonceImages ?? [],

    status: a.status,
    updatedAt: a.updatedAt ? new Date(a.updatedAt) : "",
    createdAt: a.createdAt ? new Date(a.createdAt) : "",
  }));

  console.log("annonces", annonces)

  // 5) Total pages basé sur le total Mongo (pas la longueur d'une page)
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  // 6) Rendu UI (inchangé)
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Mobile Filter Button/Modal */}
      <div className="block md:hidden w-full px-2 pt-4">
        <FormSearchUI
          lang={params.locale}
          typeAnnoncesEndpoint={typeAnnoncesEndpoint}
          categoriesEndpoint={categoriesEndpoint}
          subCategoriesEndpoint={subCategoriesEndpoint}
          mobile
          // i18n keys
          annonceTypeLabel={t("filter.type")}
          selectTypeLabel="Sélectionner le type"
          selectCategoryLabel="Sélectionner la catégorie"
          selectSubCategoryLabel="Sélectionner la sous-catégorie"
          formTitle="Rechercher une annonce"
          priceLabel="Prix"
          searchButtonLabel="Rechercher"
        />
      </div>

      <div className="flex flex-col md:flex-row min-h-screen max-w-screen-2xl mx-auto gap-6 px-2 md:px-4 py-4 md:py-8">
        {/* Sidebar (only on md+) */}
        <div className="hidden md:block md:basis-1/5 md:w-1/5">
          <FormSearchUI
            lang={params.locale}
            typeAnnoncesEndpoint={typeAnnoncesEndpoint}
            categoriesEndpoint={categoriesEndpoint}
            subCategoriesEndpoint={subCategoriesEndpoint}
            // i18n keys
            annonceTypeLabel={t("filter.type")}
            selectTypeLabel="Sélectionner le type"
            selectCategoryLabel="Sélectionner la catégorie"
            selectSubCategoryLabel="Sélectionner la sous-catégorie"
            formTitle="Rechercher une annonce"
            priceLabel="Prix"
            searchButtonLabel="Rechercher"
          />
        </div>

        {/* Main Content */}
        <section className="flex-1 bg-white rounded-2xl shadow-lg p-4 md:p-8 min-w-0">
          <div className="mb-6">
            <AnnoceTitle title={t("nav.Annoce")} />
          </div>
          {annonces?.length ? (
            <ListAnnoncesUI
              totalPages={totalPages}
              currentPage={currentPage}
              lang={params.locale}
              annonces={annonces}
              imageServiceUrl="https://picsum.photos"
            />
          ) : (
            <div className="flex justify-center items-center">
              <LottieAnimation />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
