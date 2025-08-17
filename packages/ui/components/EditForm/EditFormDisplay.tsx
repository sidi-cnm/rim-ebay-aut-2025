"use client";
import React from "react";

interface EditFormDisplayProps {
  editTitle: string;
  annonceTypeLabel: string;
  categoryLabel: string;
  selectCategoryLabel: string;
  subCategoryLabel: string;
  selectSubCategoryLabel: string;
  descriptionLabel: string;
  priceLabel: string;
  cancelLabel: string;
  updateLabel: string;
  submitting?: boolean;

  typeAnnonces: any[];
  categories: any[];
  filteredSubCategories: any[];

  selectedTypeId: string;
  setSelectedTypeId: (id: string) => void;

  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;

  selectedSubCategoryId: string;
  setSelectedSubCategoryId: (id: string) => void;

  description: string;
  setDescription: (v: string) => void;

  price: string;
  setPrice: (v: string) => void;

  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;

  lang: string;
}

const EditFormDisplay: React.FC<EditFormDisplayProps> = ({
  editTitle,
  annonceTypeLabel,
  categoryLabel,
  selectCategoryLabel,
  subCategoryLabel,
  selectSubCategoryLabel,
  descriptionLabel,
  priceLabel,
  cancelLabel,
  updateLabel,
  typeAnnonces,
  categories,
  filteredSubCategories,
  selectedTypeId,
  setSelectedTypeId,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedSubCategoryId,
  setSelectedSubCategoryId,
  description,
  setDescription,
  price,
  setPrice,
  handleSubmit,
  onClose,
  lang,
}) => {
  const isRTL = lang?.startsWith("ar");

  return (
    <div
    role="dialog"
    aria-modal="true"
    dir={isRTL ? "rtl" : "ltr"}
    className="
      w-full
      max-w-[260px]       /* très compact sur mobile */
      sm:max-w-[300px]    /* petit écran */
      md:max-w-[360px]    /* desktop */
      lg:max-w-[400px]    /* grand écran */
      bg-white
      rounded-lg
      border border-gray-200
      shadow-lg
      p-3 sm:p-4
      max-h-[80vh] overflow-y-auto
    "
  >
  
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold">
          {editTitle}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          aria-label="Close"
          title="Close"
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 px-3 text-sm md:text-base">
        {/* Type annonce */}
        <div>
          <label className="block mb-1 font-medium">{annonceTypeLabel}</label>
          <select
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(String(e.target.value))}
            className="border rounded w-full p-2"
          >
            <option value="">{annonceTypeLabel}</option>
            {typeAnnonces?.map((t: any) => (
              <option key={t.id} value={t.id}>
                {isRTL ? t.nameAr ?? t.name : t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block mb-1 font-medium">{categoryLabel}</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(String(e.target.value))}
            className="border rounded w-full p-2"
            disabled={!selectedTypeId}
          >
            <option value="">{selectCategoryLabel}</option>
            {categories?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {isRTL ? c.nameAr ?? c.name : c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sous-catégorie */}
        <div>
          <label className="block mb-1 font-medium">{subCategoryLabel}</label>
          <select
            value={selectedSubCategoryId}
            onChange={(e) => setSelectedSubCategoryId(String(e.target.value))}
            className="border rounded w-full p-2"
            disabled={!selectedCategoryId}
          >
            <option value="">{selectSubCategoryLabel}</option>
            {filteredSubCategories?.map((sc: any) => (
              <option key={sc.id} value={sc.id}>
                {isRTL ? sc.nameAr ?? sc.name : sc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">{descriptionLabel}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded w-full p-2"
            rows={4}
            required
          />
        </div>

        {/* Prix */}
        <div>
          <label className="block mb-1 font-medium">{priceLabel}</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded w-full p-2"
            min={0}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {updateLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFormDisplay;
