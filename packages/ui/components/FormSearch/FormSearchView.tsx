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
        className="bg-white shadow-lg rounded-lg p-6 space-y-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {annonceTypeLabel}
          </label>
          <select
            value={selectedTypeId}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="">{selectTypeLabel}</option>
            {typeAnnonces.map((type) => (
              <option key={type.id} value={type.id}>
                {labelName(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {categoryLabel}
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={!selectedTypeId}
            className="w-full rounded border p-2 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">{selectCategoryLabel}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {labelName(c)}
              </option>
            ))}
          </select>
        </div>

        {/* Sous-catégorie */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {subCategoryLabel}
          </label>
          <select
            value={selectedSubCategoryId}
            onChange={(e) => onSubCategoryChange(e.target.value)}
            disabled={!selectedCategoryId}
            className="w-full rounded border p-2 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">{selectSubCategoryLabel}</option>
            {subCategories.map((s) => (
              <option key={s.id} value={s.id}>
                {labelName(s)}
              </option>
            ))}
          </select>
        </div>

        {/* Wilaya */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {wilayaLabel}
          </label>
          <select
            value={selectedWilayaId}
            onChange={(e) => onWilayaChange(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="">{selectWilayaLabel}</option>
            {wilayas.map((w) => (
              <option key={w.id} value={w.id}>
                {labelName(w)}
              </option>
            ))}
          </select>
        </div>

        {/* Moughataa */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {moughataaLabel}
          </label>
          <select
            value={selectedMoughataaId}
            onChange={(e) => onMoughataaChange(e.target.value)}
            disabled={!selectedWilayaId}
            className="w-full rounded border p-2 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">{selectMoughataaLabel}</option>
            {moughataas.map((m) => (
              <option key={m.id} value={m.id}>
                {labelName(m)}
              </option>
            ))}
          </select>
        </div>

        {/* Prix */}
        <div>
          <label className="block text-sm font-medium mb-1">{priceLabel}</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div className="text-sm text-gray-500">
          {isSamsar ? "Vous êtes connecté en tant que Samsar." : "Vous n'êtes pas connecté en tant que Samsar."}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded bg-blue-900 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "..." : searchButtonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
