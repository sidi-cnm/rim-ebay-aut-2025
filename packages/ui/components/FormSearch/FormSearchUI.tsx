// packages/ui/components/FormSearch/FormSearchUI.tsx
"use client";

import { useState, useEffect, useMemo, startTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faXmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "../../../../locales/client";
import FormSearch from "./FormSearchdDynamicOptions";
import { Search } from "lucide-react";


interface Filters {
  typeAnnonceId?: string;
  categorieId?: string;
  subCategorieId?: string;
  price?: string;
  description?: string;
  // 👇 nouveaux
  wilayaId?: string;
  moughataaId?: string;
  aiQuery?: string;
}

interface InputProps {
  lang: string;
  typeAnnoncesEndpoint: string;
  categoriesEndpoint: string;
  subCategoriesEndpoint: string;
  // 👇 nouveaux
  lieuxEndpoint: string;             // ex: /fr/p/api/tursor/lieux
  wilayaLabel?: string;
  selectWilayaLabel?: string;
  moughataaLabel?: string;
  selectMoughataaLabel?: string;
  aiSearchPlaceholder?: string; // New prop for placeholder

  mobile?: boolean;
  annonceTypeLabel?: string;
  selectTypeLabel?: string;
  selectCategoryLabel?: string;
  selectSubCategoryLabel?: string;
  formTitle?: string;
  priceLabel?: string;
  searchButtonLabel?: string;
  isSamsar?: boolean;
}

export function FormSearchUI({
  lang,
  typeAnnoncesEndpoint,
  categoriesEndpoint,
  subCategoriesEndpoint,
  lieuxEndpoint,                   // 👈 add
  wilayaLabel ,
  selectWilayaLabel ,
  moughataaLabel ,
  selectMoughataaLabel ,
  aiSearchPlaceholder,
  mobile = false,
  annonceTypeLabel,
  selectTypeLabel,
  selectCategoryLabel,
  selectSubCategoryLabel,
  formTitle,
  priceLabel,
  searchButtonLabel,
  isSamsar
}: InputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useI18n();

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for AI Search
  const [aiQuery, setAiQuery] = useState(searchParams?.get("aiQuery") || "");

  const currentUrlKey = useMemo(
    () => `${pathname}?${searchParams?.toString() || ""}`,
    [pathname, searchParams]
  );
  const [prevUrlKey, setPrevUrlKey] = useState(currentUrlKey);

  useEffect(() => {
    if (loading && currentUrlKey !== prevUrlKey) {
      setLoading(false);
      setPrevUrlKey(currentUrlKey);
    }
  }, [currentUrlKey, prevUrlKey, loading]);

  

  const handleSearchSubmit = async (filters: Filters) => {
    // 1) On part de l'URL actuelle pour garder les filtres déjà présents
    const params = new URLSearchParams(searchParams?.toString() ?? "");
  
    // 2) Nettoyer uniquement les clés gérées par CE formulaire
    //    ⚠️ Ne PAS inclure 'issmar' ni 'directNegotiation' ici
    const managedKeys = [
      "typeAnnonceId",
      "categorieId",
      "subCategorieId",
      "price",
      "wilayaId",
      "moughataaId",
      "description",
      "aiQuery",
    ];
    managedKeys.forEach((k) => params.delete(k));
  
    // 3) Injecter les nouveaux filtres du formulaire
    Object.entries(filters).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      params.set(k, typeof v === "boolean" ? String(v) : String(v));
    });
  
    // 4) Reset pagination (on garde issmar & directNegotiation intacts)
    params.delete("page");


    // 5) make post call to /api/p/search for insert search params
    fetch(`/${lang}/api/p/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      // Convert URLSearchParams to a plain object
      body: JSON.stringify(Object.fromEntries(params)),
    }).catch(console.error);

    setLoading(true);
    setModalOpen(false);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };
  
  

  const isRTL = lang.startsWith("ar");


  // Scroll lock effect
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  // --- MOBILE ---
  if (mobile) {
    const alignClass = isRTL ? "text-right" : "text-left";
    const [mobileQuery, setMobileQuery] = useState(searchParams?.get("aiQuery") || "");

    const handleMobileSearch = () => {
       const params = new URLSearchParams();
       if (mobileQuery.trim()) {
         params.set("aiQuery", mobileQuery.trim());
       }
       router.push(`${pathname}?${params.toString()}`);
    };

    return (
      <div className="w-full px-4 mb-4 pt-4">
        {/* Row 1: Search Input */}
        <div className="relative flex items-center bg-white rounded-xl shadow-sm border border-gray-200 mb-3 overflow-hidden">
             <button 
                onClick={handleMobileSearch}
                className={`flex items-center justify-center bg-blue-600 text-white w-12 h-12 absolute top-0 ${isRTL ? "left-0" : "right-0"}`}
             >
                <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
             </button>
             <input 
                type="text"
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMobileSearch()}
                placeholder={t("filter.search") + "..."}
                className={`w-full py-3 px-4 text-gray-700 outline-none h-12 ${isRTL ? "pl-14 text-right" : "pr-14 text-left"}`}
             />
        </div>

        {/* Row 2: Action Buttons */}
        <div className="flex gap-3">
             {/* Advanced Search Button - Blue */}
             <button 
                onClick={() => setModalOpen(true)}
                className="flex-1 text-white bg-blue-600 rounded-lg shadow-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors h-12"
             >
                {/* Using valid 'faFilter' icon for settings/advanced */}
                <span className="font-bold">{t("filter.title")}</span>
                <FontAwesomeIcon icon={faFilter} /> 
             </button>
        </div>

        {/* Modal Logic (Existing) */}
        {modalOpen && (
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            {/* ... keeping modal content same ... */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <div className="flex min-h-full items-center justify-center p-4">
              <div 
              style={{
                width: "-webkit-fill-available",
              }}
              className="relative w-[94vw] max-w-[420px] bg-white rounded-2xl shadow-2xl p-2 sm:p-2 max-h-[85vh] overflow-y-auto text-sm space-y-3"
              >
                <button
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: "#2563eb",
                    top: "8px",
                    right: "8px",
                  }}
                  className="rounded-full inline-flex items-center justify-center text-white absolute top-1 right-1 p-1 w-8 h-8 focus:outline-none"
                  aria-label={t("filter.close")}
                >
                  <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                </button>

                <FormSearch
                  lang={lang}
                  onSubmit={handleSearchSubmit}
                  typeAnnoncesEndpoint={typeAnnoncesEndpoint}
                  categoriesEndpoint={categoriesEndpoint}
                  subCategoriesEndpoint={subCategoriesEndpoint}
                  lieuxEndpoint={lieuxEndpoint}
                  wilayaLabel={t("filter.wilayatyepe")}
                  selectWilayaLabel={t("filter.selectWilayaLabel")}
                  moughataaLabel={t("filter.mougtaatype")}
                  selectMoughataaLabel={t("filter.selectMoughataaLabel")}
                  annonceTypeLabel={annonceTypeLabel ?? t("filter.annonceType")}
                  selectTypeLabel={selectTypeLabel ?? t("filter.selectType")}
                  categoryLabel={selectCategoryLabel ?? t("filter.selectCategory")}
                  selectCategoryLabel={selectCategoryLabel ?? t("filter.selectCategory")}
                  subCategoryLabel={selectSubCategoryLabel ?? t("filter.selectSubCategory")}
                  selectSubCategoryLabel={selectSubCategoryLabel ?? t("filter.selectSubCategory")}
                  formTitle={formTitle ?? t("filter.title")}
                  priceLabel={priceLabel ?? t("filter.price")}
                  searchButtonLabel={searchButtonLabel ?? t("filter.search")}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- DESKTOP ---
  return (
    <aside
      className={`max-w-sm w-72 z-40 shadow-2xl ${isRTL ? "right-0" : "left-0"} ${isRTL ? "rounded-l-2xl" : "rounded-r-2xl"} flex flex-col items-center transition-transform duration-300 h-full bg-white rounded-2xl p-8 border border-gray-200`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col h-full w-full">
        <FormSearch
          lang={lang}
          onSubmit={handleSearchSubmit}
          typeAnnoncesEndpoint={typeAnnoncesEndpoint}


          categoriesEndpoint={categoriesEndpoint}
          subCategoriesEndpoint={subCategoriesEndpoint}
          // 👇 nouveaux
          lieuxEndpoint={lieuxEndpoint}
          wilayaLabel={t("filter.wilayatyepe")}
          selectWilayaLabel={t("filter.selectWilayaLabel")}
          moughataaLabel={t("filter.mougtaatype")}
          selectMoughataaLabel={t("filter.selectMoughataaLabel")}
          annonceTypeLabel={annonceTypeLabel ?? t("filter.annonceType")}
          selectTypeLabel={selectTypeLabel ?? t("filter.selectType")}
          categoryLabel={selectCategoryLabel ?? t("filter.selectCategory")}
          selectCategoryLabel={selectCategoryLabel ?? t("filter.selectCategory")}
          subCategoryLabel={selectSubCategoryLabel ?? t("filter.selectSubCategory")}
          selectSubCategoryLabel={selectSubCategoryLabel ?? t("filter.selectSubCategory")}
          formTitle={formTitle ?? t("filter.title")}
          priceLabel={priceLabel ?? t("filter.price")}
          searchButtonLabel={searchButtonLabel ?? t("filter.search")}
          loading={loading}
        />
      </div>
    </aside>
  );
}
