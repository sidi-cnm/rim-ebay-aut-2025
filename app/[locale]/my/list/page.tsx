import { MyListAnnoncesUI } from "./ui";
import { LottieAnimation } from "../../../../packages/ui/components/LottieAnimation";
import { FormSearchUI } from "../../../../packages/ui/components/FormSearch/FormSearchUI";
import { Annonce } from "../../../../packages/mytypes/types";
import { getUserFromCookies } from "../../../../utiles/getUserFomCookies";

import { getDb } from "../../../../lib/mongodb";

// ⬇️ corrige la signature: params & searchParams sont des objets, pas des Promises
export default async function Home({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: {
    page?: string;
    typeAnnonceId?: string;
    categorieId?: string;
    subCategorieId?: string;
    price?: string;
  };
}) {
  // 1) Récupérer l’utilisateur (pour filtrer par userId)
  const userData = await getUserFromCookies();
  const userId = userData?.id ?? ""; // si vide => retournera 0 résultat

  // 2) Lire les filtres/pagination dans l’URL
  const currentPage = Number(searchParams?.page) || 1;
  const typeAnnonceId = searchParams?.typeAnnonceId;
  const categorieId = searchParams?.categorieId;
  const subCategorieId = searchParams?.subCategorieId; // NOTE: champ en DB = subcategorieId
  const price = searchParams?.price;

  // 3) Construire la requête Mongo (équivalent where Prisma)
  const query: Record<string, any> = {};
  if (userId) query.userId = userId;
  if (typeAnnonceId) query.typeAnnonceId = typeAnnonceId;
  if (categorieId) query.categorieId = categorieId;
  // ⚠️ orthographe EXACTE de ton schéma: "subcategorieId" (ie)
  if (subCategorieId) query.subcategorieId = subCategorieId;
  if (price && !isNaN(Number(price))) query.price = Number(price);

  // 4) Interroger MongoDB (pagination + total)
  const db = await getDb();
  const coll = db.collection("annonces");

  const itemsPerPage = 6;
  const skip = (currentPage - 1) * itemsPerPage;

  const [rows, totalCount] = await Promise.all([
    coll
      .find(query)
      .sort({ updatedAt: -1 }) // optionnel
      .skip(skip)
      .limit(itemsPerPage)
      .toArray(),
    coll.countDocuments(query),
  ]);

  // 5) Mapper vers ton type Annonce (équivalent du mapping Prisma)
  const annonces: Annonce[] = rows.map((a: any) => ({
    id: String(a._id ?? a.id),
    typeAnnonceId: a.typeAnnonceId,
    typeAnnonceid: a.typeAnnonceId,

    // si tu n’imbriques pas ces objets dans "annonces", ils seront undefined (OK grâce à ?? "")
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
    firstImagePath: a.firstImagePath ? String(a.firstImagePath) : undefined,
    images: a.annonceImages ?? [],

    status: a.status,
    updatedAt: a.updatedAt ? new Date(a.updatedAt) : undefined,
    createdAt: a.createdAt ? new Date(a.createdAt) : undefined,
  }));


  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  // 6) Rendu UI (garde exactement ton UI existante)
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Filtres Mobile */}
      <div className="block md:hidden w-full px-2 pt-4">
        <FormSearchUI
          lang={params.locale}
          // si tu as refait l’API options sur Mongo, mets /fr/p/api/mongo/options
          typeAnnoncesEndpoint="/fr/p/api/sqlite/options"
          categoriesEndpoint="/fr/p/api/sqlite/options"
          subCategoriesEndpoint="/fr/p/api/sqlite/options"
          mobile
        />
      </div>

      <div className="flex flex-col md:flex-row min-h-screen max-w-screen-2xl mx-auto gap-6 px-2 md:px-4 py-4 md:py-8">
        {/* Sidebar Desktop */}
        <div className="hidden md:block md:basis-1/5 md:w-1/5">
          <FormSearchUI
            lang={params.locale}
            typeAnnoncesEndpoint="/fr/p/api/sqlite/options"
            categoriesEndpoint="/fr/p/api/sqlite/options"
            subCategoriesEndpoint="/fr/p/api/sqlite/options"
          />
        </div>

        {/* Contenu principal */}
        <section className="flex-1 bg-white rounded-2xl shadow-lg p-4 md:p-8 min-w-0">
          {annonces?.length ? (
            <MyListAnnoncesUI
              totalPages={totalPages}
              currentPage={currentPage}
              annonces={annonces}
              lang={params.locale}
              imageServiceUrl="https://picsum.photos"
            />
          ) : (
            <div className="flex justify-center items-center">
               <div>Veuillez vous connecter pour voir vos annonces.</div>
              {/* <LottieAnimation /> */}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
