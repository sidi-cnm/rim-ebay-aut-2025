"use client";
import React, { useEffect, useState } from "react";
import { useI18n } from "../../../../locales/client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Category, SubCategory, TypeAnnonce } from "../../../../packages/mytypes/types";

type Position = "owner" | "broker" | "other";

type Props = {
  lang?: string;
  relavieUrlOptionsModel: string;
  /** Indique si l'utilisateur est inscrit comme courtier (samsar) */
  isSamsar?: boolean;
  onNext: (payload: {
    typeAnnonceId: string;
    categorieId: string;
    subcategorieId: string;
    title: string;
    description: string;
    price: number | null;

    // Nouveaux champs
    position: Position;
    directNegotiation?: boolean | null;
    classificationFr: string;
    classificationAr: string;
  }) => void;
  initial?: {
    typeAnnonceId?: string;
    categorieId?: string;
    subcategorieId?: string;
    description?: string;
    price?: number | null | undefined;

    // Valeurs si retour en arrière
    position?: Position;
    directNegotiation?: boolean | null;
  };
};

export default function AddAnnonceStep1({
  lang = "ar",
  relavieUrlOptionsModel,
  isSamsar = false,
  onNext,
  initial,
}: Props) {
  const t = useI18n();

  // --- Données ---
  const [typeAnnonces, setTypeAnnonces] = useState<TypeAnnonce[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);

  // --- Sélections ---
  const [selectedTypeId, setSelectedTypeId] = useState<string>(initial?.typeAnnonceId ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initial?.categorieId ?? "");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(initial?.subcategorieId ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<string>(initial?.price != null ? String(initial.price) : "");

  // --- Nouveaux états ---
  const [position, setPosition] = useState<Position>(initial?.position ?? (isSamsar ? "broker" : "owner"));
  const [directNegotiation, setDirectNegotiation] = useState<boolean | null>(
    initial?.directNegotiation ?? null
  );

  // Charger Types d'annonces
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${relavieUrlOptionsModel}/options`);
        if (!res.ok) throw new Error();
        setTypeAnnonces(await res.json());
      } catch {
        toast.error(t("errors.fetchTypeAnnonces"));
      }
    })();
  }, [relavieUrlOptionsModel, t]);

  // Charger catégories selon type
  useEffect(() => {
    (async () => {
      if (!selectedTypeId) {
        setCategories([]);
        return;
      }
      try {
        const res = await axios.get(
          `${relavieUrlOptionsModel}/options?parentId=${encodeURIComponent(selectedTypeId)}`
        );
        setCategories(res.data);
      } catch {
        toast.error(t("errors.fetchCategories"));
      }
    })();
  }, [selectedTypeId, relavieUrlOptionsModel, t]);

  // Charger sous-catégories selon catégorie
  useEffect(() => {
    (async () => {
      if (!selectedCategoryId) {
        setFilteredSubCategories([]);
        return;
      }
      try {
        const res = await axios.get(
          `${relavieUrlOptionsModel}/options?parentId=${encodeURIComponent(selectedCategoryId)}`
        );
        setFilteredSubCategories(res.data);
      } catch {
        toast.error(t("errors.fetchSubCategories"));
      }
    })();
  }, [selectedCategoryId, relavieUrlOptionsModel, t]);

  // Si on n'est pas courtier, on nettoie la sous-question
  useEffect(() => {
    if (position !== "broker") {
      setDirectNegotiation(null);
    }
  }, [position]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    // validations
    if (!selectedTypeId || !selectedCategoryId || !selectedSubCategoryId || !description.trim() || !price) {
      toast.error(t("errors.requiredFields"));
      return;
    }
    if (position === "broker" && directNegotiation == null) {
      toast.error(t("addAnnonce.needDirectChoice") ?? "Précisez si la négociation est directe.");
      return;
    }


    const typeObj = typeAnnonces.find(t => String(t.id) === String(selectedTypeId));
    const catObj  = categories.find(c => String(c.id) === String(selectedCategoryId));
    const subObj  = filteredSubCategories.find(s => String(s.id) === String(selectedSubCategoryId));
  
    const classificationFr = [
      typeObj?.name ?? "",
      catObj?.name ?? "",
      subObj?.name ?? "",
    ].filter(Boolean).join("/");
  
    const classificationAr = [
      typeObj?.nameAr ?? "",
      catObj?.nameAr ?? "",
      subObj?.nameAr ?? "",
    ].filter(Boolean).join("/");

    

    const title = description.substring(0, 50);

    onNext({
      typeAnnonceId: selectedTypeId,
      categorieId: selectedCategoryId,
      subcategorieId: selectedSubCategoryId,
      title,
      description,
      price: price === "" ? null : Number(price),

      position,
      directNegotiation: directNegotiation ,
      classificationFr,
      classificationAr
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Toaster position="bottom-right" />
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {t("addAnnonce.addNew")}
      </h2>

      <form onSubmit={handleNext} className="bg-white shadow-lg rounded-lg p-6 space-y-5">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("addAnnonce.annonceType")}
          </label>
          <select
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(String(e.target.value))}
            className="w-full rounded border p-2"
          >
            <option value="">{t("addAnnonce.selectType")}</option>
            {typeAnnonces.map((type) => (
              <option key={type.id} value={type.id}>
                {lang === "ar" ? type.nameAr : type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("addAnnonce.category")}
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(String(e.target.value))}
            disabled={!selectedTypeId}
            className="w-full rounded border p-2 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">{t("addAnnonce.selectCategory")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {lang === "ar" ? category.nameAr : category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sous-catégorie */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("addAnnonce.subCategory")}
          </label>
          <select
            value={selectedSubCategoryId}
            onChange={(e) => setSelectedSubCategoryId(String(e.target.value))}
            disabled={!selectedCategoryId}
            className="w-full rounded border p-2 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">{t("addAnnonce.selectSubCategory")}</option>
            {filteredSubCategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {lang === "ar" ? sub.nameAr : sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("addAnnonce.description")}
          </label>
          <textarea
            rows={4}
            className="w-full rounded border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Prix */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("addAnnonce.price")}
          </label>
        <input
            type="number"
            className="w-full rounded border p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
          />
        </div>

        {/* Position & négociation directe (sans commission) */}
        {isSamsar && (

          <fieldset className="border rounded-md p-3">
          <legend className="px-1 text-sm text-gray-700">
            {t("addAnnonce.positionLegend") ?? "Votre position par rapport au bien"}
          </legend>

          <div className="flex flex-col gap-2 mt-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="position"
                value="owner"
                checked={position === "owner"}
                onChange={() => setPosition("owner")}
                className="h-4 w-4 text-blue-700"
              />
              <span>{t("addAnnonce.owner") ?? "Propriétaire"}</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="position"
                value="broker"
                checked={position === "broker"}
                onChange={() => setPosition("broker")}
                className="h-4 w-4 text-blue-700"
              />
              <span>{t("addAnnonce.broker") ?? "Courtier / Intermédiaire"}</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="position"
                value="other"
                checked={position === "other"}
                onChange={() => setPosition("other")}
                className="h-4 w-4 text-blue-700"
              />
              <span>{t("addAnnonce.other")}</span>
            </label>
          </div>

          {position === "broker" && (
            <div className="mt-4">
              <span className="block text-sm mb-2">
                {t("addAnnonce.directQ")}
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
                  <span>{t("common.yes")}</span>
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
        

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded bg-blue-900 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            {t("common.next")}
          </button>
        </div>
      </form>
    </div>
  );
}
