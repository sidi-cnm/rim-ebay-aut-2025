"use client";
import React, { useEffect, useState } from "react";
import { useI18n } from "../../../../locales/client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Category, SubCategory, TypeAnnonce } from "../../../../packages/mytypes/types";

type Props = {
  lang?: string;
  relavieUrlOptionsModel: string;
  onNext: (payload: {
    typeAnnonceId: string;
    categorieId: string;
    subcategorieId: string;
    title: string;
    description: string;
    price: number | null;
  }) => void;
  initial?: {
    typeAnnonceId?: string;
    categorieId?: string;
    subcategorieId?: string;
    description?: string;
    price?: number | null | undefined;
  };
};

export default function AddAnnonceStep1({
  lang = "ar",
  relavieUrlOptionsModel,
  onNext,
  initial,
}: Props) {
  const t = useI18n();

  const [typeAnnonces, setTypeAnnonces] = useState<TypeAnnonce[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>(initial?.typeAnnonceId ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initial?.categorieId ?? "");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(initial?.subcategorieId ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<string>(initial?.price != null ? String(initial.price) : "");

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

  useEffect(() => {
    (async () => {
      if (!selectedTypeId) { setCategories([]); return; }
      try {
        const res = await axios.get(`${relavieUrlOptionsModel}/options?parentId=${encodeURIComponent(selectedTypeId)}`);
        setCategories(res.data);
      } catch {
        toast.error(t("errors.fetchCategories"));
      }
    })();
  }, [selectedTypeId, relavieUrlOptionsModel, t]);

  useEffect(() => {
    (async () => {
      if (!selectedCategoryId) { setFilteredSubCategories([]); return; }
      try {
        const res = await axios.get(`${relavieUrlOptionsModel}/options?parentId=${encodeURIComponent(selectedCategoryId)}`);
        setFilteredSubCategories(res.data);
      } catch {
        toast.error(t("errors.fetchSubCategories"));
      }
    })();
  }, [selectedCategoryId, relavieUrlOptionsModel, t]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTypeId || !selectedCategoryId || !selectedSubCategoryId || !description.trim() || !price) {
      toast.error(t("errors.requiredFields"));
      return;
    }
    const title = description.substring(0, 50);
    onNext({
      typeAnnonceId: selectedTypeId,
      categorieId: selectedCategoryId,
      subcategorieId: selectedSubCategoryId,
      title,
      description,
      price: price === "" ? null : Number(price),
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Toaster position="bottom-right" />
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {t("addAnnonce.addNew")}
      </h2>

      <form onSubmit={handleNext} className="bg-white shadow-lg rounded-lg p-6 space-y-5">
        {/* ... mêmes champs qu’avant ... */}
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
            className="w-full rounded border p-2"
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
            className="w-full rounded border p-2"
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

        <div className="flex justify-end">
          <button type="submit" className="inline-flex items-center rounded bg-blue-900 px-5 py-2 font-semibold text-white hover:bg-blue-700">
            {t("common.next")}
          </button>
        </div>
      </form>
    </div>
  );
}
