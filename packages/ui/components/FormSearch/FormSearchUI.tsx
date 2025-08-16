"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import FormSearch from "./FormSearchdDynamicOptions";
import { useRouter } from "next/navigation";

interface Filters {
  typeAnnonceId?: string;
  categorieId?: string;
  subCategorieId?: string;
  price?: string;
  description?: string;
}

type LabelKeys =
  | "annonceTypeLabel"
  | "selectTypeLabel"
  | "selectCategoryLabel"
  | "selectSubCategoryLabel"
  | "formTitle"
  | "priceLabel"
  | "searchButtonLabel";

type Labels = Record<LabelKeys, string>;

const LABELS_BY_LANG: Record<string, Labels> = {
  fr: {
    annonceTypeLabel: "Type d'annonce",
    selectTypeLabel: "Sélectionner le type",
    selectCategoryLabel: "Sélectionner la catégorie",
    selectSubCategoryLabel: "Sélectionner la sous-catégorie",
    formTitle: "Rechercher une annonce",
    priceLabel: "Prix",
    searchButtonLabel: "Rechercher",
  },
  ar: {
    annonceTypeLabel: "نوع الإعلان",
    selectTypeLabel: "اختر النوع",
    selectCategoryLabel: "اختر الفئة",
    selectSubCategoryLabel: "اختر الفئة الفرعية",
    formTitle: "البحث عن إعلان",
    priceLabel: "السعر",
    searchButtonLabel: "بحث",
  },
};

interface InputProps {
  lang: string;
  typeAnnoncesEndpoint: string;
  categoriesEndpoint: string;
  subCategoriesEndpoint: string;
  mobile?: boolean;

  // overrides optionnels (si tu veux remplacer un label spécifique)
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
  // overrides (facultatifs)
  annonceTypeLabel,
  selectTypeLabel,
  selectCategoryLabel,
  selectSubCategoryLabel,
  formTitle,
  priceLabel,
  searchButtonLabel,
}: InputProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  // // 1) i18n: récup labels par langue + overrides
  // const base = LABELS_BY_LANG[lang] ?? LABELS_BY_LANG.fr;
  const langKey = (lang || "fr").split("-")[0]; // "ar-MR" -> "ar"
  const base = LABELS_BY_LANG[langKey] ?? LABELS_BY_LANG.fr;
  const isRTL = langKey === "ar";

  console.log("FormSearchUI lang=", lang);
  console.log("FormSearchUI base=", base);
  console.log("FormSearchUI isRTL=", isRTL);
  console.log("FormSearchUI labels=", {
    annonceTypeLabel,
    selectTypeLabel,
    selectCategoryLabel,
    selectSubCategoryLabel,
    formTitle,
    priceLabel,
    searchButtonLabel,
  });

  
  const labels: Labels = {
    annonceTypeLabel: base.annonceTypeLabel,
    selectTypeLabel: base.selectTypeLabel,
    selectCategoryLabel:  base.selectCategoryLabel,
    selectSubCategoryLabel:  base.selectSubCategoryLabel,
    formTitle:  base.formTitle,
    priceLabel: base.priceLabel,
    searchButtonLabel:  base.searchButtonLabel,
  };

  // 2) submit → push query string
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
            <span>{isRTL ? "تصفية" : "Filtrer"}</span>
          </button>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-2 relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-red-600"
                aria-label={isRTL ? "إغلاق" : "Fermer"}
              >
                &times;
              </button>

              <FormSearch
                lang={lang}
                onSubmit={handleSearchSubmit}
                typeAnnoncesEndpoint={typeAnnoncesEndpoint}
                categoriesEndpoint={categoriesEndpoint}
                subCategoriesEndpoint={subCategoriesEndpoint}
                // labels (on fournit tout, y compris alias attendus par FormSearch)
                annonceTypeLabel={labels.annonceTypeLabel}
                selectTypeLabel={labels.selectTypeLabel}
                categoryLabel={labels.selectCategoryLabel}
                selectCategoryLabel={labels.selectCategoryLabel}
                subCategoryLabel={labels.selectSubCategoryLabel}
                selectSubCategoryLabel={labels.selectSubCategoryLabel}
                formTitle={labels.formTitle}
                priceLabel={labels.priceLabel}
                searchButtonLabel={labels.searchButtonLabel}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // --- DESKTOP (sidebar) ---
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
          // labels
          annonceTypeLabel={labels.annonceTypeLabel}
          selectTypeLabel={labels.selectTypeLabel}
          categoryLabel={labels.selectCategoryLabel}
          selectCategoryLabel={labels.selectCategoryLabel}
          subCategoryLabel={labels.selectSubCategoryLabel}
          selectSubCategoryLabel={labels.selectSubCategoryLabel}
          formTitle={labels.formTitle}
          priceLabel={labels.priceLabel}
          searchButtonLabel={labels.searchButtonLabel}
        />
      </div>
    </aside>
  );
}
