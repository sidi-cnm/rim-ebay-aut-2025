// app/[locale]/my/add/AddAnnonceStep1.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useI18n } from "../../../../locales/client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Category, SubCategory, TypeAnnonce } from "../../../../packages/mytypes/types";

type Props = {
  lang?: string;
  relavieUrlOptionsModel: string;
  relavieUrlAnnonce: string;
  onCreated: (annonceId: string) => void;
};

export default function AddAnnonceStep1({
  lang = "ar",
  relavieUrlOptionsModel,
  relavieUrlAnnonce,
  onCreated,
}: Props) {
  const t = useI18n();

  const [typeAnnonces, setTypeAnnonces] = useState<TypeAnnonce[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch(`${relavieUrlOptionsModel}/options`);
        if (!res.ok) throw new Error();
        setTypeAnnonces(await res.json());
      } catch {
        toast.error(t("errors.fetchTypeAnnonces"));
      }
    };
    fetchTypes();
  }, [relavieUrlOptionsModel, t]);

  useEffect(() => {
    const fetchCats = async () => {
      if (!selectedTypeId) { setCategories([]); return; }
      try {
        const res = await axios.get(`${relavieUrlOptionsModel}/options?parentId=${encodeURIComponent(selectedTypeId)}`);
        setCategories(res.data);
      } catch {
        toast.error(t("errors.fetchCategories"));
      }
    };
    fetchCats();
  }, [selectedTypeId, relavieUrlOptionsModel, t]);

  useEffect(() => {
    const fetchSubs = async () => {
      if (!selectedCategoryId) { setFilteredSubCategories([]); return; }
      try {
        const res = await axios.get(`${relavieUrlOptionsModel}/options?parentId=${encodeURIComponent(selectedCategoryId)}`);
        setFilteredSubCategories(res.data);
      } catch {
        toast.error(t("errors.fetchSubCategories"));
      }
    };
    fetchSubs();
  }, [selectedCategoryId, relavieUrlOptionsModel, t]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTypeId || !selectedCategoryId || !selectedSubCategoryId) {
      toast.error(t("errors.requiredFields"));
      return;
    }
    setSubmitting(true);
    const loading = toast.loading(t("notifications.creating"));

    try {
      const annonceData = {
        typeAnnonceId: selectedTypeId,
        categorieId: selectedCategoryId,
        subcategorieId: selectedSubCategoryId,
        lieuId: selectedSubCategoryId,
        title: description.substring(0, 50),
        description,
        price: Number(price),
        haveImage: false,
        firstImagePath: "",
        images: [],
        status: "active",
      };

      const res = await fetch(`${relavieUrlAnnonce}`, {
        method: "POST",
        body: JSON.stringify(annonceData),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Create failed");
      }
      const data = await res.json().catch(() => ({}));
      const createdId = String(data?.id ?? data?._id ?? data?.annonceId ?? "");
      if (!createdId) throw new Error("No id returned by API");

      toast.success(t("notifications.success"), { id: loading });
      onCreated(createdId); // ⬅️ on passe à l’étape 2
    } catch (e: any) {
      toast.error(e?.message || t("notifications.error"), { id: loading });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Toaster position="bottom-right" />
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {t("addAnnonce.addNew")}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-5">
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
            required
          />
        </div>

        {/* CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded bg-blue-900 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            {submitting ? t("notifications.creating") : t("addAnnonce.submitButton")}
          </button>
        </div>
      </form>
    </div>
  );
}
