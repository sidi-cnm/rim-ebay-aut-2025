// app/[locale]/page.tsx
import ListAnnoncesUI from "./ui/ListAnnoncesUI";
import { FormSearchUI } from "../../packages/ui/components/FormSearch/FormSearchUI";
import { getI18n } from "../../locales/server";
import { Annonce } from "../../packages/mytypes/types";
import { getAnnonces, Search } from "../../lib/services/annoncesService";

import SearchBar from "../../packages/ui/components/FormSearch/SearchBar";

type Params = { locale: string };
// Search type imported from service



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

  const { annonces, totalPages, currentPage, totalCount, isSamsar, favoriteIds } = await getAnnonces(sp);
  // //sqlite api endpoints
  // let lieuxEndpoint = `/${locale}/p/api/sqlite/lieux`;
  // let optionsEndpoint = `/${locale}/p/api/sqlite/options`;
  // // si on est en production alors on utilise les endpoints turso
  // console.log("NODE_ENV:", process.env.NODE_ENV);
  // if (process.env.NODE_ENV === "production") {
  //   // turso api endpoints
  //   optionsEndpoint = `/${locale}/p/api/tursor/options`;
  //   lieuxEndpoint = `/${locale}/p/api/tursor/lieux`;
  // }
  const optionsEndpoint = `/${locale}/p/api/tursor/options`;
  const lieuxEndpoint = `/${locale}/p/api/tursor/lieux`;

  const isRTL = locale.startsWith("ar");

  return (
    <main className="min-h-screen bg-gray-100">
      
      {/* Search Header Section */}
      <div className="hidden md:block bg-gray-100 px-4">
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
            <div>
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
