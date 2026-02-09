
// app/[locale]/favorites/page.tsx
import { getFavoriteAnnonces } from "../../../../lib/services/annoncesService";
import { getI18n } from "../../../../locales/server";
import { getUserFromCookies } from "../../../../utiles/getUserFomCookies";
import ListAnnoncesUI from "../../ui/ListAnnoncesUI";
import AnnoceTitle from "../../../../packages/ui/components/AnnoceTitle";

type Params = { locale: string };
type Search = { page?: string };

export default async function FavoritesPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<Search>;
}) {
  const { locale } = await params;
  const sp = (await searchParams) ?? {};
  const t = await getI18n();

  // -------- Auth requise --------
  const user = await getUserFromCookies();
  if (!user?.id) {
    return (
      <main className="min-h-screen bg-gray-100">
        <section className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 mt-6">
          <AnnoceTitle title={t("nav.favorites")} />
          <p className="mt-4 text-gray-600">
            {t("card.loginRequired") /* “Vous devez être connecté…” */}
          </p>
        </section>
      </main>
    );
  }

  // -------- Pagination --------
  const currentPage = Number(sp.page) || 1;
  const itemsPerPage = 6;
  const skip = (currentPage - 1) * itemsPerPage;

  // 1) Récupérer les favoris via le service
  const { annonces, totalPages, totalCount } = await getFavoriteAnnonces(
    sp,
    String(user.id)
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row items-center md:items-start min-h-screen max-w-screen-2xl mx-auto gap-6 px-2 md:px-4 py-4 md:py-8">
        <section className="w-full max-w-[720px] md:max-w-none md:flex-1 mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8 min-w-0">
          <div className="mb-6">
            <AnnoceTitle title={t("nav.favorites")} />
          </div>

          {annonces.length ? (
            <ListAnnoncesUI
              totalPages={totalPages}
              currentPage={currentPage}
              lang={locale}
              annonces={annonces}
              imageServiceUrl="https://picsum.photos"
              favoriteIds={annonces.map(a => String(a.id))} // pour peindre le cœur
            />
          ) : (
            <div className="py-16 text-center text-gray-500">
              {t("card.empty") /* “Aucune annonce en favori.” */}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
