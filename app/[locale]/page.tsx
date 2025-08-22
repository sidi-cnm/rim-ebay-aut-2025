// app/[locale]/page.tsx
import ListAnnoncesUI from "./ui/ListAnnoncesUI";
import { FormSearchUI } from "../../packages/ui/components/FormSearch/FormSearchUI";
import AnnoceTitle from "../../packages/ui/components/AnnoceTitle";
import { getI18n } from "../../locales/server";
import { Annonce } from "../../packages/mytypes/types";
import { getDb } from "../../lib/mongodb";

type Params = { locale: string };
type Search = {
  page?: string;
  typeAnnonceId?: string;
  categorieId?: string;
  subCategorieId?: string; // en DB: subcategorieId
  price?: string;
};

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<Params>;             // 👈 Promesses
  searchParams?: Promise<Search>;      // 👈 Promesses
}) {
  const { locale } = await params;     // 👈 await
  const sp = (await searchParams) ?? {}; // 👈 await + fallback

  const t = await getI18n();

  let apiBase = process.env.NEXT_PUBLIC_OPTIONS_API_MODE
  console.log("apiBase : "  , apiBase)

  // 1) Pagination & filtres
  const currentPage = Number(sp.page) || 1;
  const itemsPerPage = 6;
  const skip = (currentPage - 1) * itemsPerPage;

  // 2) Query Mongo
  const query: Record<string, any> = { isPublished: false };
  if (sp.typeAnnonceId) query.typeAnnonceId = sp.typeAnnonceId;
  if (sp.categorieId) query.categorieId = sp.categorieId;
  if (sp.subCategorieId) query.subcategorieId = sp.subCategorieId;
  if (sp.price && !isNaN(Number(sp.price))) query.price = Number(sp.price);

  // 3) Lecture Mongo
  const db = await getDb();
  const coll = db.collection("annonces");

  const [rows, totalCount] = await Promise.all([
    coll.find(query).sort({ updatedAt: -1 }).skip(skip).limit(itemsPerPage).toArray(),
    coll.countDocuments(query),
  ]);

  // 4) Mapping
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
    updatedAt: a.updatedAt ? new Date(a.updatedAt) : undefined,  // 👈 évite les strings vides
    createdAt: a.createdAt ? new Date(a.createdAt) : undefined,
  }));

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  // 5) UI
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Mobile */}
      <div className="block md:hidden w-full px-2 pt-4">
        <FormSearchUI
          lang={locale}
          typeAnnoncesEndpoint={`/fr/p/api/${apiBase}/options`}
          categoriesEndpoint={`/fr/p/api/${apiBase}/options`}
          subCategoriesEndpoint={`/fr/p/api/${apiBase}/options`}
          mobile
          annonceTypeLabel={t("filter.type")}
          selectTypeLabel="Sélectionner le type"
          selectCategoryLabel="Sélectionner la catégorie"
          selectSubCategoryLabel="Sélectionner la sous-catégorie"
          formTitle="Rechercher une annonce"
          priceLabel="Prix"
          searchButtonLabel="Rechercher"
        />
      </div>

      {/* Desktop */}
      <div className="flex flex-col md:flex-row items-start min-h-screen max-w-screen-2xl mx-auto gap-6 px-2 md:px-4 py-4 md:py-8">
        <aside className="hidden md:block w-80 xl:w-96 flex-shrink-0 self-start">
          <div className="sticky top-6 h-[calc(100vh-3rem)]">
            <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 overflow-y-auto">
              <FormSearchUI
                lang={locale}
                typeAnnoncesEndpoint={`/fr/p/api/${apiBase}/options`}
                categoriesEndpoint={`/fr/p/api/${apiBase}/options`}
                subCategoriesEndpoint={`/fr/p/api/${apiBase}/options`}
                annonceTypeLabel={t("filter.type")}
                selectTypeLabel="Sélectionner le type"
                selectCategoryLabel="Sélectionner la catégorie"
                selectSubCategoryLabel="Sélectionner la sous-catégorie"
                formTitle="Rechercher une annonce"
                priceLabel="Prix"
                searchButtonLabel="Rechercher"
              />
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-white rounded-2xl shadow-lg p-4 md:p-8 min-w-0">
          <div className="mb-6">
            <AnnoceTitle title={t("nav.Annoce")} />
          </div>

          {annonces.length ? (
            <ListAnnoncesUI
              totalPages={totalPages}
              currentPage={currentPage}
              lang={locale}
              annonces={annonces}
              imageServiceUrl="https://picsum.photos"
            />
          ) : (
            <div className="flex justify-center items-center">Aucun annonce pour le moment</div>
          )}
        </section>
      </div>
    </main>
  );
}


