"use client";
import React from "react";
import { useI18n } from "../../../../locales/client";

interface EditFormDisplayProps {
  editTitle: string;
  annonceTypeLabel: string;
  userFromDB: boolean;
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
  wilayas: any[];
  moughataas: any[];
  categories: any[];
  filteredSubCategories: any[];

  selectedTypeId: string;
  setSelectedTypeId: (id: string) => void;

  selectedWilayaId: string;
  setSelectedWilayaId: (id: string) => void;

  selectedMoughataaId: string;
  setSelectedMoughataaId: (id: string) => void;

  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;

  selectedSubCategoryId: string;
  setSelectedSubCategoryId: (id: string) => void;

  description: string;
  setDescription: (v: string) => void;

  price: string;
  setPrice: (v: string) => void;

  rentalPeriod: string;
  setRentalPeriod: (id: string) => void;
  rentalPeriodAr: string;
  setRentalPeriodAr: (id: string) => void;

  issmar: boolean;
  setIssmar: (id: boolean) => void;

  directNegotiation: boolean | null;
  setDirectNegotiation: (id: boolean | null) => void;

  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  onEditImages: () => void;

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
  wilayas,
  moughataas,
  categories,
  filteredSubCategories,
  selectedTypeId,
  setSelectedTypeId,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedSubCategoryId,
  setSelectedSubCategoryId,
  userFromDB,
  selectedWilayaId,
  setSelectedWilayaId,
  selectedMoughataaId,
  setSelectedMoughataaId,
  description,
  setDescription,
  price,
  submitting,
  setPrice,
  rentalPeriod,
  setRentalPeriod,
  rentalPeriodAr,
  setRentalPeriodAr,
  issmar,
  setIssmar,
  directNegotiation,
  setDirectNegotiation,
  handleSubmit,
  onClose,
  onEditImages,
  lang,
}) => {
  const isRTL = lang?.startsWith("ar");
  const t = useI18n();

  // Trouver le typeAnnonce sélectionné
  const selectedType = typeAnnonces.find((t: any) => String(t.id) === String(selectedTypeId));
  console.log("typeAnnonces:test", typeAnnonces);
  console.log("selectedType:", selectedType);
  const isLocation =
    selectedType &&
    (selectedType.name?.toLowerCase() === "location" ||
      selectedType.nameAr?.includes("يجار"));

  console.log("ismsar:", issmar);    
  console.log("directNegotiation:", directNegotiation);
  console.log("rentalPeriod:", rentalPeriod);
  console.log("rentalPeriodAr:", rentalPeriodAr);
  console.log("isLocation:", isLocation);
  console.log("selectedTypeId:", selectedTypeId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full max-w-[260px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[400px] 
                 bg-white rounded-lg border border-gray-200 shadow-lg p-3 sm:p-4 
                 max-h-[80vh] overflow-y-auto"
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

        {/* Wilaya */}
        <div>
          <label className="block mb-1 font-medium">{t("editForm.wilaya")}</label>
          <select
            value={selectedWilayaId}
            onChange={(e) => setSelectedWilayaId(e.target.value)}
            className="border rounded w-full p-2"
          >
            <option value="">{t("editForm.selectWilaya")}</option>
            {wilayas.map((w: any) => (
              <option key={w.id} value={w.id}>
                {isRTL ? w.nameAr ?? w.name : w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Moughataa */}
        <div>
          <label className="block mb-1 font-medium">{t("editForm.moughataa")}</label>
          <select
            value={selectedMoughataaId}
            onChange={(e) => setSelectedMoughataaId(e.target.value)}
            className="border rounded w-full p-2"
            disabled={!selectedWilayaId}
          >
            <option value="">{t("editForm.selectMoughataa")}</option>
            {moughataas.map((m: any) => (
              <option key={m.id} value={m.id}>
                {isRTL ? m.nameAr ?? m.name : m.name}
              </option>
            ))}
          </select>
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

        {/* Rental period : seulement si type = Location/إيجار */}
        {isLocation && (
          <div className="mb-4">
            <label className="block text-sm font-medium">
              {t("editForm.rentalPeriod")}
            </label>
            <select
              value={rentalPeriod}
              onChange={(e) => {
                const value = e.target.value;
                setRentalPeriod(value);

                // 🔗 synchroniser rentalPeriodAr aussi
                switch (value) {
                  case "daily":
                    setRentalPeriodAr("يومي");
                    break;
                  case "weekly":
                    setRentalPeriodAr("أسبوعي");
                    break;
                  case "monthly":
                    setRentalPeriodAr("شهري");
                    break;
                  default:
                    setRentalPeriodAr("");
                }
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">{isRTL ? "-- اختر --" : "-- Select --"}</option>
              <option value="daily">
                {isRTL ? "يومي" : t("editForm.Journalier")}
              </option>
              <option value="weekly">
                {isRTL ? "أسبوعي" : t("editForm.Hebdomadaire")}
              </option>
              <option value="monthly">
                {isRTL ? "شهري" : t("editForm.Mensuel")}
              </option>
            </select>
          </div>
        )}



        {/* Issmar : si true => afficher les options */}
       {/* Samsar / Position */}
       {userFromDB && (
        <fieldset className="border rounded-md p-3 border-gray-200">
          <legend className="px-1 text-sm text-gray-700">
            {t("addAnnonce.positionLegend") ?? "Votre position par rapport au bien"}
          </legend>

          <div className="flex flex-col gap-2 mt-2">
            {/* Propriétaire */}
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="position"
                value="owner"
                checked={!issmar} // affiché mais non sélectionnable si pas samsar
                onChange={() => {
                  setIssmar(false);
                  setDirectNegotiation(null);
                }}
                className="h-4 w-4 text-blue-700"
              />
              <span>{t("addAnnonce.owner") ?? "Propriétaire"}</span>
            </label>

            {/* Courtier / Intermédiaire */}
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="position"
                value="broker"
                checked={issmar && directNegotiation !== null}
                onChange={() => {
                  setIssmar(true);
                  setDirectNegotiation(false); // par défaut, négociation non directe
                }}
                className="h-4 w-4 text-blue-700"
              />
              <span>{t("addAnnonce.broker") ?? "Courtier / Intermédiaire"}</span>
            </label>

            {/* Autre */}
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="position"
                value="other"
                checked={issmar && directNegotiation === null}
                onChange={() => {
                  setIssmar(true);
                  setDirectNegotiation(null);
                }}
                className="h-4 w-4 text-blue-700"
              />
              <span>{t("addAnnonce.other") ?? "Autre"}</span>
            </label>
          </div>

          {/* Sous-question si broker */}
          {issmar && directNegotiation !== null && (
            <div className="mt-4">
              <span className="block text-sm mb-2">
                {t("addAnnonce.directQ") ?? "La négociation est-elle directe ?"}
              </span>
              <div className="flex gap-6">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="directNegotiation"
                    value="yes"
                    checked={directNegotiation === true}
                    onChange={() => setDirectNegotiation(true)}
                    className="h-4 w-4 text-blue-700"
                  />
                  <span>{t("common.yes") ?? "Oui"}</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="directNegotiation"
                    value="no"
                    checked={directNegotiation === false}
                    onChange={() => setDirectNegotiation(false)}
                    className="h-4 w-4 text-blue-700"
                  />
                  <span>{t("common.no") ?? "Non"}</span>
                </label>
              </div>
            </div>
          )}
        </fieldset>
      )}



        {/* Boutons */}
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {updateLabel}
          </button>
        </div>
      </form>

      <button
            type="submit"
            onClick={onEditImages}
            className="bg-blue-600 w-full mt-2 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {t("editForm.images")}
          </button>
    </div>
  );
};

export default EditFormDisplay;
