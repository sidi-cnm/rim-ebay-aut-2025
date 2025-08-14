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

interface InputProps {
  lang: string;
  typeAnnoncesEndpoint: string;
  categoriesEndpoint: string;
  subCategoriesEndpoint: string;
  mobile?: boolean;
}

export function FormSearchUI({
  lang,
  typeAnnoncesEndpoint,
  categoriesEndpoint,
  subCategoriesEndpoint,
  mobile = false
}: InputProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSearchSubmit = async (filters: Filters) => {
      const params = new URLSearchParams(
      Object.entries(filters).map(([key, value]) => [key, value?.toString() || ""])
    );
    router.push(`?${params.toString()}`);
    setModalOpen(false); // Close modal on mobile after search
  };

  // Sidebar position: left for 'fr', right for 'ar'
  const sidebarPosition = lang === "ar" ? "right-0" : "left-0";
  const roundedSide = lang === "ar" ? "rounded-l-2xl" : "rounded-r-2xl";

  if (mobile) {
    // Mobile: Only render button and modal
  return (
      <>
        <div className="w-full flex justify-end mb-4">
      <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-800 text-white rounded-xl px-4 py-2 shadow hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Filtrer</span>
          </button>
        </div>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-2 relative">
            <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-red-600"
                aria-label="Fermer"
            >
                &times;
            </button>
            {/* <I18nProviderClient locale={lang}> */}
              <FormSearch
                lang={lang}
                onSubmit={handleSearchSubmit}
                typeAnnoncesEndpoint={typeAnnoncesEndpoint}
                categoriesEndpoint={categoriesEndpoint}
                subCategoriesEndpoint={subCategoriesEndpoint}
                //i18n keys
                annonceTypeLabel="Type d'annonce"
                selectTypeLabel="Sélectionner le type"
                selectCategoryLabel="Sélectionner la catégorie"
                selectSubCategoryLabel="Sélectionner la sous-catégorie"
                formTitle="Rechercher une annonce"
                priceLabel="Prix"
                searchButtonLabel="Rechercher"
              />
            {/* </I18nProviderClient> */}
          </div>
        </div>
      )}
      </>
    );
  }

  // Desktop: Only render sidebar
  return (
<aside
  className={`max-w-sm w-72 z-40 shadow-2xl ${sidebarPosition} ${roundedSide} flex flex-col items-center transition-transform duration-300 h-full bg-white rounded-2xl p-8 border border-gray-200`}
>
  <div className="flex flex-col h-full w-full">
    {/* <I18nProviderClient locale={lang}> */}
      <FormSearch
        lang={lang}
        onSubmit={handleSearchSubmit}
        typeAnnoncesEndpoint={typeAnnoncesEndpoint}
        categoriesEndpoint={categoriesEndpoint}
        subCategoriesEndpoint={subCategoriesEndpoint}
        //i18n keys
        annonceTypeLabel="Type d'annonce"
        selectTypeLabel="Sélectionner le type"
        selectCategoryLabel="Sélectionner la catégorie"   
        selectSubCategoryLabel="Sélectionner la sous-catégorie"
        formTitle="Rechercher une annonce"
        priceLabel="Prix"
        searchButtonLabel="Rechercher"
      />
    {/* </I18nProviderClient> */}
    </div>
</aside>

  );
}
