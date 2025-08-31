// app/[locale]/my/list/page.tsx
import { MyListAnnoncesUI } from "./ui";
import { FormSearchUI } from "../../../../packages/ui/components/FormSearch/FormSearchUI";
import { Annonce } from "../../../../packages/mytypes/types";
import { getUserFromCookies } from "../../../../utiles/getUserFomCookies";
import { getDb } from "../../../../lib/mongodb";

type PageParams = { locale: string };
type SP = {
  page?: string;
  typeAnnonceId?: string;
  categorieId?: string;
  subCategorieId?: string;
  price?: string;
};

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;                // <-- Promises
  searchParams?: Promise<SP>;
}) {
  const { locale } = await params;           // <-- await
  const sp = (await searchParams) ?? {};

  // 1) Utilisateur
  const userData = await getUserFromCookies();
  const userId = userData?.id ?? "";

  // 2) Filtres/pagination
  const currentPage = Number(sp.page) || 1;
  const typeAnnonceId = sp.typeAnnonceId;
  const categorieId = sp.categorieId;
  const subCategorieId = sp.subCategorieId;  // DB: subcategorieId
  const price = sp.price;

  // 3) Query Mongo
  const query: Record<string, any> = { status: "active" };
  if (userId) query.userId = userId;
  if (typeAnnonceId) query.typeAnnonceId = typeAnnonceId;
  if (categorieId) query.categorieId = categorieId;
  if (subCategorieId) query.subcategorieId = subCategorieId;
  if (price && !isNaN(Number(price))) query.price = Number(price);

  // 4) Mongo + pagination
  const db = await getDb();
  const coll = db.collection("annonces");
  const itemsPerPage = 6;
  const skip = (currentPage - 1) * itemsPerPage;

  const [rows, totalCount] = await Promise.all([
    coll.find(query).sort({ updatedAt: -1 }).skip(skip).limit(itemsPerPage).toArray(),
    coll.countDocuments(query),
  ]);

  // 5) Mapping
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
    haveImage: !!a.haveImage,
    firstImagePath: a.firstImagePath ? String(a.firstImagePath) : undefined,
    images: a.annonceImages ?? [],
    status: a.status,
    updatedAt: a.updatedAt ? new Date(a.updatedAt) : undefined,
    createdAt: a.createdAt ? new Date(a.createdAt) : undefined,
  }));

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  let apiBase = process.env.NEXT_PUBLIC_OPTIONS_API_MODE
  const lieuxEndpoint = `/${locale}/p/api/tursor/lieux`;

  // 6) UI
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Mobile filters - largeur fixe */}
      <div className="md:hidden pt-4 flex justify-center">
        <div style={{ maxWidth: 340, width: "90%" }}>
          <FormSearchUI
            lang={locale}                                 // <-- utilise locale
            typeAnnoncesEndpoint={`/fr/p/api/${apiBase}/options`}
            lieuxEndpoint={lieuxEndpoint}
            categoriesEndpoint={`/fr/p/api/${apiBase}/options`}
            subCategoriesEndpoint={`/fr/p/api/${apiBase}/options`}
            mobile
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row min-h-screen max-w-screen-2xl mx-auto gap-6 px-2 md:px-4 py-4 md:py-8">
        {/* Sidebar Desktop */}
        <div className="hidden md:block md:basis-1/5 md:w-1/5">
          <FormSearchUI
            lang={locale}
            typeAnnoncesEndpoint={`/fr/p/api/${apiBase}/options`}
            lieuxEndpoint={lieuxEndpoint}
            categoriesEndpoint={`/fr/p/api/${apiBase}/options`}
            subCategoriesEndpoint={`/fr/p/api/${apiBase}/options`}
          />
        </div>

        {/* Main */}
        <section className="flex-1 bg-white rounded-2xl shadow-lg p-4 md:p-8 min-w-0">
          {annonces.length ? (
            <MyListAnnoncesUI
              totalPages={totalPages}
              currentPage={currentPage}
              annonces={annonces}
              lang={locale}
              imageServiceUrl="https://picsum.photos"
            />
          ) : (
            <div className="flex justify-center items-center">
              <div>Aucun Annouce pour le moment .</div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
