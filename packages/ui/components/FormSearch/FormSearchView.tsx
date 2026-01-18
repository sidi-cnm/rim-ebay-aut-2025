"use client";
import React from "react";

interface FormSearchViewProps {
  lang: string;
  typeAnnonces: any[];
  categories: any[];
  subCategories: any[];
  wilayas: any[];
  moughataas: any[];

  selectedTypeId: string;
  selectedCategoryId: string;
  selectedSubCategoryId: string;
  selectedWilayaId: string;
  selectedMoughataaId: string;
  price: string;

  onTypeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubCategoryChange: (value: string) => void;
  onWilayaChange: (value: string) => void;
  onMoughataaChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onSearch: () => void;

  annonceTypeLabel: string;
  selectTypeLabel: string;
  categoryLabel: string;
  selectCategoryLabel: string;
  subCategoryLabel: string;
  selectSubCategoryLabel: string;
  wilayaLabel: string;
  selectWilayaLabel: string;
  moughataaLabel: string;
  selectMoughataaLabel: string;
  priceLabel: string;
  formTitle: string;
  searchButtonLabel: string;

  loading?: boolean;
  isSamsar?: boolean;
}

export default function FormSearchView({
  lang,
  typeAnnonces,
  categories,
  subCategories,
  wilayas,
  moughataas,
  selectedTypeId,
  selectedCategoryId,
  selectedSubCategoryId,
  selectedWilayaId,
  selectedMoughataaId,
  price,
  onTypeChange,
  onCategoryChange,
  onSubCategoryChange,
  onWilayaChange,
  onMoughataaChange,
  onPriceChange,
  onSearch,
  annonceTypeLabel,
  selectTypeLabel,
  categoryLabel,
  selectCategoryLabel,
  subCategoryLabel,
  selectSubCategoryLabel,
  wilayaLabel,
  selectWilayaLabel,
  moughataaLabel,
  selectMoughataaLabel,
  priceLabel,
  formTitle,
  searchButtonLabel,
  loading = false,
  isSamsar
}: FormSearchViewProps) {
  const isRTL = lang?.startsWith("ar");
  const labelName = (item: any) => (lang === "ar" ? item?.nameAr : item?.name);

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        {formTitle}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="space-y-5"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Type */}
        <div className="group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            {annonceTypeLabel}
          </label>
          <div className="relative">
            <select
              value={selectedTypeId}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl px-4 py-3 pr-8 transition-all duration-200 outline-none text-gray-900 font-medium"
            >
              <option value="">{selectTypeLabel}</option>
              {typeAnnonces.map((type) => (
                <option key={type.id} value={type.id}>
                  {labelName(type)}
                </option>
              ))}
            </select>
            <div className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'left-3' : 'right-3'}`}>
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Catégorie */}
        <div className="group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            {categoryLabel}
          </label>
          <div className="relative">
            <select
              value={selectedCategoryId}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={!selectedTypeId}
              className="w-full appearance-none bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl px-4 py-3 pr-8 transition-all duration-200 outline-none text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{selectCategoryLabel}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {labelName(c)}
                </option>
              ))}
            </select>
             <div className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'left-3' : 'right-3'}`}>
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sous-catégorie */}
        <div className="group">
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            {subCategoryLabel}
          </label>
          <div className="relative">
            <select
              value={selectedSubCategoryId}
              onChange={(e) => onSubCategoryChange(e.target.value)}
              disabled={!selectedCategoryId}
              className="w-full appearance-none bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl px-4 py-3 pr-8 transition-all duration-200 outline-none text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{selectSubCategoryLabel}</option>
              {subCategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {labelName(s)}
                </option>
              ))}
            </select>
             <div className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'left-3' : 'right-3'}`}>
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Wilaya */}
        <div className="group">
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            {wilayaLabel}
          </label>
          <div className="relative">
            <select
              value={selectedWilayaId}
              onChange={(e) => onWilayaChange(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl px-4 py-3 pr-8 transition-all duration-200 outline-none text-gray-900 font-medium"
            >
              <option value="">{selectWilayaLabel}</option>
              {wilayas.map((w) => (
                <option key={w.id} value={w.id}>
                  {labelName(w)}
                </option>
              ))}
            </select>
             <div className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'left-3' : 'right-3'}`}>
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Moughataa */}
        <div className="group">
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            {moughataaLabel}
          </label>
          <div className="relative">
            <select
              value={selectedMoughataaId}
              onChange={(e) => onMoughataaChange(e.target.value)}
              disabled={!selectedWilayaId}
              className="w-full appearance-none bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl px-4 py-3 pr-8 transition-all duration-200 outline-none text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{selectMoughataaLabel}</option>
              {moughataas.map((m) => (
                <option key={m.id} value={m.id}>
                  {labelName(m)}
                </option>
              ))}
            </select>
             <div className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'left-3' : 'right-3'}`}>
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Prix */}
        <div className="group">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            {priceLabel}
          </label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl px-4 py-3 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400"
          />
        </div>

        {isSamsar && (
           <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Vous êtes connecté en tant que Samsar
           </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center rounded-xl bg-primary-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 hover:shadow-primary-600/40 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {searchButtonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
