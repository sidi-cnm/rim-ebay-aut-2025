// packages/ui/components/FormSearch/FormSearchUI.tsx
"use client";

import { useState, useEffect, useMemo, startTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "../../../../locales/client";
import FormSearch from "./FormSearchdDynamicOptions";

interface Filters {
  typeAnnonceId?: string;
  categorieId?: string;
  subCategorieId?: string;
  price?: string;
  description?: string;
  // 👇 nouveaux
  wilayaId?: string;
  moughataaId?: string;
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

  mobile?: boolean;
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
  lieuxEndpoint,                   // 👈 add
  wilayaLabel ,
  selectWilayaLabel ,
  moughataaLabel ,
  selectMoughataaLabel ,
  mobile = false,
  annonceTypeLabel,
  selectTypeLabel,
  selectCategoryLabel,
  selectSubCategoryLabel,
  formTitle,
  priceLabel,
  searchButtonLabel,
}: InputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useI18n();

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const next = new URLSearchParams(
      Object.entries(filters).map(([k, v]) => [k, v?.toString() || ""])
    );
    const nextUrlKey = `${pathname}?${next.toString()}`;
    if (nextUrlKey === currentUrlKey) {
      setModalOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setModalOpen(false);
    startTransition(() => {
      router.push(`?${next.toString()}`);
    });
  };

  const isRTL = lang.startsWith("ar");

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
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-[94vw] max-w-[420px] bg-white rounded-2xl shadow-2xl p-4 sm:p-5 max-h-[80vh] overflow-y-auto text-sm space-y-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-600"
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
            </div>
          </div>
        )}
      </>
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
