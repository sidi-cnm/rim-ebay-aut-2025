"use client";
import React from "react";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface FormSearchViewProps {
  lang: string;
  typeAnnonces: any[];
  categories: any[];
  subCategories: any[];
  selectedTypeId: string;
  selectedCategoryId: string;
  selectedSubCategoryId: string;
  price: string;
  onTypeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubCategoryChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onSearch: () => void;
  annonceTypeLabel: string;
  selectTypeLabel: string;
  categoryLabel: string;
  selectCategoryLabel: string;
  subCategoryLabel: string;
  selectSubCategoryLabel: string;
  priceLabel: string;
  formTitle: string;
  searchButtonLabel: string;
  loading?: boolean;
}

export default function FormSearchView({
  lang,
  typeAnnonces,
  categories,
  subCategories,
  selectedTypeId,
  selectedCategoryId,
  selectedSubCategoryId,
  price,
  onTypeChange,
  onCategoryChange,
  onSubCategoryChange,
  onPriceChange,
  onSearch,
  annonceTypeLabel,
  selectTypeLabel,
  categoryLabel,
  selectCategoryLabel,
  subCategoryLabel,
  selectSubCategoryLabel,
  priceLabel,
  formTitle,
  searchButtonLabel,
  loading = false,
}: FormSearchViewProps) {
  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        {formTitle}
      </h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Type */}
          <div>
            <label className="block text-gray-600 mb-2">{annonceTypeLabel}</label>
            <select
              value={selectedTypeId}
              onChange={(e) => onTypeChange(e.target.value)}
              className="hidden md:block border rounded w-full p-2"
              aria-label={annonceTypeLabel}
            >
              <option value="">{selectTypeLabel}</option>
              {typeAnnonces.map((type: any) => (
                <option key={type.id} value={type.id}>
                  {lang === "ar" ? type.nameAr : type.name}
                </option>
              ))}
            </select>

            <div className="block md:hidden">
              <Listbox value={selectedTypeId} onChange={onTypeChange}>
                <div className="relative">
                  <Listbox.Button className="relative w-full border rounded bg-white py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-normal">
                    {selectedTypeId
                      ? (lang === "ar"
                          ? typeAnnonces.find((t) => t.id === selectedTypeId)?.nameAr
                          : typeAnnonces.find((t) => t.id === selectedTypeId)?.name)
                      : selectTypeLabel}
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Listbox.Option value="">
                      {({ active }) => (
                        <span className={`${active ? "bg-blue-100" : ""} block px-4 py-2 text-gray-500`}>
                          {selectTypeLabel}
                        </span>
                      )}
                    </Listbox.Option>
                    {typeAnnonces.map((type) => (
                      <Listbox.Option key={type.id} value={type.id}>
                        {({ selected, active }) => (
                          <span className={`block px-4 py-2 ${selected ? "font-bold" : ""} ${active ? "bg-blue-100" : ""}`}>
                            {lang === "ar" ? type.nameAr : type.name}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-gray-600 mb-2">{categoryLabel}</label>
            <select
              value={selectedCategoryId || ""}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={!selectedTypeId}
              className="hidden md:block border rounded w-full p-2"
              aria-label={categoryLabel}
            >
              <option value="">{selectCategoryLabel}</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {lang === "ar" ? c.nameAr : c.name}
                </option>
              ))}
            </select>

            <div className="block md:hidden">
              <Listbox value={selectedCategoryId} onChange={onCategoryChange} disabled={!selectedTypeId}>
                <div className="relative">
                  <Listbox.Button className="relative w-full border rounded bg-white py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-normal disabled:bg-gray-100 disabled:text-gray-400">
                    {selectedCategoryId
                      ? (lang === "ar"
                          ? categories.find((c) => c.id === selectedCategoryId)?.nameAr
                          : categories.find((c) => c.id === selectedCategoryId)?.name)
                      : selectCategoryLabel}
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Listbox.Option value="">
                      {({ active }) => (
                        <span className={`${active ? "bg-blue-100" : ""} block px-4 py-2 text-gray-500`}>
                          {selectCategoryLabel}
                        </span>
                      )}
                    </Listbox.Option>
                    {categories.map((c) => (
                      <Listbox.Option key={c.id} value={c.id}>
                        {({ selected, active }) => (
                          <span className={`block px-4 py-2 ${selected ? "font-bold" : ""} ${active ? "bg-blue-100" : ""}`}>
                            {lang === "ar" ? c.nameAr : c.name}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>

          {/* Sous-catégorie */}
          <div>
            <label className="block text-gray-600 mb-2">{subCategoryLabel}</label>
            <select
              value={selectedSubCategoryId || ""}
              onChange={(e) => onSubCategoryChange(e.target.value)}
              className="hidden md:block border rounded w-full p-2"
              aria-label={subCategoryLabel}
            >
              <option value="">{selectSubCategoryLabel}</option>
              {subCategories.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {lang === "ar" ? s.nameAr : s.name}
                </option>
              ))}
            </select>

            <div className="block md:hidden">
              <Listbox value={selectedSubCategoryId} onChange={onSubCategoryChange}>
                <div className="relative">
                  <Listbox.Button className="relative w-full border rounded bg-white py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-normal">
                    {selectedSubCategoryId
                      ? (lang === "ar"
                          ? subCategories.find((s) => s.id === selectedSubCategoryId)?.nameAr
                          : subCategories.find((s) => s.id === selectedSubCategoryId)?.name)
                      : selectSubCategoryLabel}
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Listbox.Option value="">
                      {({ active }) => (
                        <span className={`${active ? "bg-blue-100" : ""} block px-4 py-2 text-gray-500`}>
                          {selectSubCategoryLabel}
                        </span>
                      )}
                    </Listbox.Option>
                    {subCategories.map((s) => (
                      <Listbox.Option key={s.id} value={s.id}>
                        {({ selected, active }) => (
                          <span className={`block px-4 py-2 ${selected ? "font-bold" : ""} ${active ? "bg-blue-100" : ""}`}>
                            {lang === "ar" ? s.nameAr : s.name}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>

          {/* Prix */}
          <div>
            <label className="block text-gray-600 mb-2">{priceLabel}</label>
            <input
              type="number"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              className="border rounded w-full p-2"
              aria-label={priceLabel}
            />
          </div>
        </div>

        {/* Bouton de recherche avec loader piloté par `loading` */}
        <button
          type="button"
          onClick={onSearch}
          disabled={loading}
          className="relative w-full bg-blue-800 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && (
            <div className="loader"></div>
          )}
          <span className={loading ? "opacity-0" : "opacity-100"}>
            {searchButtonLabel}
          </span>
        </button>
      </form>





      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin: auto;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
