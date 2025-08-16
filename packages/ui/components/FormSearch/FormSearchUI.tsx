"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useI18n } from "../../../../locales/client"; 
import FormSearch from "./FormSearchdDynamicOptions";

interface Filters {
  typeAnnonceId?: string;
  categorieId?: string;
  subCategorieId?: string;
  price?: string;
  description?: string;
}

interface InputProps {
  lang: string;
  typeAnnoncesEndpoint: string;
  categoriesEndpoint: string;
  subCategoriesEndpoint: string;
  mobile?: boolean;
   // ⬇⬇⬇ AJOUTER CES PROPS (idéalement optionnelles)
   annonceTypeLabel?: string;
   selectTypeLabel?: string;
   selectCategoryLabel?: string;
   selectSubCategoryLabel?: string;
   formTitle?: string;
   priceLabel?: string;
   searchButtonLabel?: string;
}

export function FormSearchUI({
  lang,
  typeAnnoncesEndpoint,
  categoriesEndpoint,
  subCategoriesEndpoint,
  mobile = false,
}: InputProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const t = useI18n();

  const isRTL = lang.startsWith("ar");

  const handleSearchSubmit = async (filters: Filters) => {
    const params = new URLSearchParams(
      Object.entries(filters).map(([k, v]) => [k, v?.toString() || ""])
    );
    router.push(`?${params.toString()}`);
    setModalOpen(false);
  };

  const sidebarPosition = isRTL ? "right-0" : "left-0";
  const roundedSide = isRTL ? "rounded-l-2xl" : "rounded-r-2xl";

  // --- MOBILE ---
  if (mobile) {
    return (
      <>
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-800 text-white rounded-xl px-4 py-2 shadow hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>{t("filter.filterBtn")}</span>
          </button>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-2 relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-red-600"
                aria-label={t("filter.close")}
              >
                &times;
              </button>

              <FormSearch
                lang={lang}
                onSubmit={handleSearchSubmit}
                typeAnnoncesEndpoint={typeAnnoncesEndpoint}
                categoriesEndpoint={categoriesEndpoint}
                subCategoriesEndpoint={subCategoriesEndpoint}
                annonceTypeLabel={t("filter.annonceType")}
                selectTypeLabel={t("filter.selectType")}
                categoryLabel={t("filter.selectCategory")}
                selectCategoryLabel={t("filter.selectCategory")}
                subCategoryLabel={t("filter.selectSubCategory")}
                selectSubCategoryLabel={t("filter.selectSubCategory")}
                formTitle={t("filter.title")}
                priceLabel={t("filter.price")}
                searchButtonLabel={t("filter.search")}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // --- DESKTOP ---
  return (
    <aside
      className={`max-w-sm w-72 z-40 shadow-2xl ${sidebarPosition} ${roundedSide} flex flex-col items-center transition-transform duration-300 h-full bg-white rounded-2xl p-8 border border-gray-200`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col h-full w-full">
        <FormSearch
          lang={lang}
          onSubmit={handleSearchSubmit}
          typeAnnoncesEndpoint={typeAnnoncesEndpoint}
          categoriesEndpoint={categoriesEndpoint}
          subCategoriesEndpoint={subCategoriesEndpoint}
          annonceTypeLabel={t("filter.annonceType")}
          selectTypeLabel={t("filter.selectType")}
          categoryLabel={t("filter.selectCategory")}
          selectCategoryLabel={t("filter.selectCategory")}
          subCategoryLabel={t("filter.selectSubCategory")}
          selectSubCategoryLabel={t("filter.selectSubCategory")}
          formTitle={t("filter.title")}
          priceLabel={t("filter.price")}
          searchButtonLabel={t("filter.search")}
        />
      </div>
    </aside>
  );
}
