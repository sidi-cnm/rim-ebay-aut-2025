"use client";
import React, { useEffect, useState } from "react";
import { useI18n } from "../../../../locales/client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Category, SubCategory, TypeAnnonce } from "../../../../packages/mytypes/types";

type Position = "owner" | "broker" | "other";
type RentalPeriod = "daily" | "weekly" | "monthly";

type Props = {
  lang?: string;
  relavieUrlOptionsModel: string;
  isSamsar?: boolean;
  onNext: (payload: {
    typeAnnonceId: string;
    typeAnnonceName?: string;
    typeAnnonceNameAr?: string;
    // deviennent optionnels s’ils n’existent pas
    categorieId?: string;
    categorieName?: string;
    categorieNameAr?: string;

    subcategorieId?: string;
    title: string;
    description: string;
    price: number | null;

    position: Position;
    directNegotiation?: boolean | null;
    classificationFr: string;
    classificationAr: string;
    isSamsar: boolean;
    rentalPeriod?: RentalPeriod | null;
    rentalPeriodAr?: string | null; // ✅ nouveau
    isPriceHidden?: boolean;
    privateDescription?: string;
  }) => void;
  initial?: {
    typeAnnonceId?: string;
    typeAnnonceName?: string;
    typeAnnonceNameAr?: string;
    categorieId?: string;
    categorieName?: string;
    categorieNameAr?: string;
    subcategorieId?: string;
    description?: string;
    price?: number | null | undefined;


    position?: Position;
    directNegotiation?: boolean | null;
    isSamsar?: boolean;
    rentalPeriod?: RentalPeriod | null;
    rentalPeriodAr?: string | null; // ✅ nouveau
    isPriceHidden?: boolean;
    privateDescription?: string;
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

  // Données
  const [typeAnnonces, setTypeAnnonces] = useState<TypeAnnonce[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);

  // Sélections
  const [selectedTypeId, setSelectedTypeId] = useState<string>(initial?.typeAnnonceId ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initial?.categorieId ?? "");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(initial?.subcategorieId ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<string>(initial?.price != null ? String(initial.price) : "");
  const [isPriceHidden, setIsPriceHidden] = useState<boolean>(initial?.isPriceHidden ?? false);
  const [privateDescription, setPrivateDescription] = useState<string>(initial?.privateDescription ?? "");

  // Nouveaux états
  const [position, setPosition] = useState<Position>(initial?.position ?? (isSamsar ? "broker" : "owner"));
  const [directNegotiation, setDirectNegotiation] = useState<boolean | null>(
    initial?.directNegotiation ?? null
  );
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod | null>(
    initial?.rentalPeriod ?? null
  );

  // Ajout d’un état pour la version arabe
const [rentalPeriodAr, setRentalPeriodAr] = useState<string | null>(
  initial?.rentalPeriodAr ?? null
);

  // Erreurs champ par champ
  const [errors, setErrors] = useState<{
    type?: boolean;
    category?: boolean;
    subCategory?: boolean;
    description?: boolean;
    directNegotiation?: boolean;
    rentalPeriod?: boolean;
    rentalPeriodAr?: boolean;
  }>({});

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

  // Reset enfants quand le parent change
  useEffect(() => {
    setSelectedCategoryId("");
    setSelectedSubCategoryId("");
  }, [selectedTypeId]);
  useEffect(() => {
    setSelectedSubCategoryId("");
  }, [selectedCategoryId]);

  // Si pas courtier, on nettoie la sous-question
  useEffect(() => {
    if (position !== "broker") setDirectNegotiation(null);
  }, [position]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    const needCategory = categories.length > 0;
    const needSubcat = needCategory && filteredSubCategories.length > 0;

    // Détecter si le type sélectionné est "Location"
    const selectedType = typeAnnonces.find(t => String(t.id) === String(selectedTypeId));
    const isLocationRental = selectedType && (
      selectedType.name.toLowerCase().includes("location") ||
      selectedType.nameAr.includes("إيجار")
    );

    const nextErrors: typeof errors = {};
    if (!selectedTypeId) nextErrors.type = true;
    if (needCategory && !selectedCategoryId) nextErrors.category = true;
    if (needSubcat && !selectedSubCategoryId) nextErrors.subCategory = true;
    if (!description.trim()) nextErrors.description = true;
    if (position === "broker" && directNegotiation == null) nextErrors.directNegotiation = true;
    if (isLocationRental && !rentalPeriod) nextErrors.rentalPeriod = true;
    if (isLocationRental && !rentalPeriodAr) nextErrors.rentalPeriodAr = true;
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error(t("errors.requiredFields") ?? "Veuillez remplir les champs obligatoires.");
      return;
    }

    const typeObj = typeAnnonces.find(t => String(t.id) === String(selectedTypeId));
    const catObj  = categories.find(c => String(c.id) === String(selectedCategoryId));
    const subObj  = filteredSubCategories.find(s => String(s.id) === String(selectedSubCategoryId));

    const classificationFr = [typeObj?.name, catObj?.name, subObj?.name].filter(Boolean).join("/");
    const classificationAr = [typeObj?.nameAr, catObj?.nameAr, subObj?.nameAr].filter(Boolean).join("/");

    const title = description.substring(0, 50);

    onNext({
      typeAnnonceId: selectedTypeId,
      ...(selectedCategoryId ? { categorieId: selectedCategoryId } : {}),
      ...(selectedSubCategoryId ? { subcategorieId: selectedSubCategoryId } : {}),
      title,
      description,
      price: price === "" ? null : Number(price),
      position,
      directNegotiation,
      classificationFr,
      classificationAr,
      isSamsar,
      rentalPeriod,
      rentalPeriodAr,
      typeAnnonceName: typeObj?.name,
      typeAnnonceNameAr: typeObj?.nameAr,
      categorieName: catObj?.name,
      categorieNameAr: catObj?.nameAr,
      isPriceHidden,
      privateDescription,
    });
  };

  // Détecter si le type sélectionné est "Location"
  const selectedType = typeAnnonces.find(t => String(t.id) === String(selectedTypeId));
  const isLocationRental = selectedType && (
    selectedType.name.toLowerCase().includes("location") ||
    selectedType.nameAr.includes("إيجار")
  );

  return (
    <div className="mx-auto max-w-4xl">
      <Toaster position="bottom-right" />
      
      <form onSubmit={handleNext} className="bg-white shadow-sm border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-8">
        
        <div className="border-b border-gray-100 pb-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
                {t("addAnnonce.addNew")}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{t("addAnnonce.fillDetails")}</p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type (toujours requis) */}
            <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
                {t("addAnnonce.annonceType")} <span className="text-red-500">*</span>
            </label>
            <select
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(String(e.target.value))}
                className={`w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-gray-700 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none ${errors.type ? "border-red-300 ring-2 ring-red-50" : ""}`}
            >
                <option value="">{t("addAnnonce.selectType")}</option>
                {typeAnnonces.map((type) => (
                <option key={type.id} value={type.id}>
                    {lang === "ar" ? type.nameAr : type.name}
                </option>
                ))}
            </select>
            {errors.type && (
                <p className="text-red-500 text-xs font-medium">{t("errors.requiredType")}</p>
            )}
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
                {t("addAnnonce.category")}
            </label>
            <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(String(e.target.value))}
                disabled={!selectedTypeId || categories.length === 0}
                className={`w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-gray-700 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none disabled:bg-gray-100 disabled:text-gray-400 ${errors.category ? "border-red-300 ring-2 ring-red-50" : ""}`}
            >
                <option value="">
                {categories.length ? t("addAnnonce.selectCategory") : t("errors.noCategoryAvailable")}
                </option>
                {categories.map((category) => (
                <option key={category.id} value={category.id}>
                    {lang === "ar" ? category.nameAr : category.name}
                </option>
                ))}
            </select>
            {errors.category && (
                <p className="text-red-500 text-xs font-medium">{t("errors.requiredCategory")}</p>
            )}
            </div>

            {/* Sous-catégorie */}
            <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
                {t("addAnnonce.subCategory")}
            </label>
            <select
                value={selectedSubCategoryId}
                onChange={(e) => setSelectedSubCategoryId(String(e.target.value))}
                disabled={!selectedCategoryId || filteredSubCategories.length === 0}
                className={`w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-gray-700 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none disabled:bg-gray-100 disabled:text-gray-400 ${errors.subCategory ? "border-red-300 ring-2 ring-red-50" : ""}`}
            >
                <option value="">
                {filteredSubCategories.length ? t("addAnnonce.selectSubCategory") : t("addAnnonce.noSubCategoryAvailable")}
                </option>
                {filteredSubCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                    {lang === "ar" ? sub.nameAr : sub.name}
                </option>
                ))}
            </select>
            {errors.subCategory && (
                <p className="text-red-500 text-xs font-medium">{t("errors.requiredSubCategory")}</p>
            )}
            </div>
            
            {/* Période de location (seulement pour les annonces de location) */}
            {isLocationRental && (
                <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                    {t("addAnnonce.rentalPeriod")} <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {[
                        { val: "daily", label: t("addAnnonce.daily"), ar: "يومي" },
                        { val: "weekly", label: t("addAnnonce.weekly"), ar: "أسبوعي" },
                        { val: "monthly", label: t("addAnnonce.monthly"), ar: "شهري" },
                    ].map((opt) => (
                        <label key={opt.val} className={`
                            cursor-pointer border rounded-xl px-4 py-2 text-sm font-medium transition-all
                            ${rentalPeriod === opt.val 
                                ? "bg-primary-50 border-primary-500 text-primary-700" 
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}
                        `}>
                            <input
                                type="radio"
                                name="rentalPeriod"
                                value={opt.val}
                                checked={rentalPeriod === opt.val}
                                onChange={() => {
                                    setRentalPeriod(opt.val as any);
                                    setRentalPeriodAr(opt.ar);
                                }}
                                className="hidden"
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
                {errors.rentalPeriod && (
                    <p className="text-red-500 text-xs font-medium">{t("errors.required")}</p>
                )}
                </div>
            )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">
            {t("addAnnonce.description")} <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Décrivez votre bien en détail..."
            className={`w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-gray-700 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none resize-none ${errors.description ? "border-red-300 ring-2 ring-red-50" : ""}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-red-500 text-xs font-medium">{t("errors.requiredDescription")}</p>
          )}
        </div>

        {/* Description Privée (Optionnel) */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">
             {t("addAnnonce.privateDescription") ?? "Description privée"} <span className="text-gray-400 font-normal text-xs ml-1">{lang === "ar" ? "(اختياري)" : "(visible seulement par vous)"}</span>
          </label>
          <div className="relative">
             <textarea
                rows={2}
                placeholder={t("addAnnonce.privateDescriptionPlaceholder") ?? "Notes personnelles..."}
                className={`w-full rounded-xl border-gray-200 bg-amber-50/50 p-3 text-gray-700 focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-all outline-none resize-none ${lang === "ar" ? "pl-10" : "pr-10"}`}
                value={privateDescription}
                onChange={(e) => setPrivateDescription(e.target.value)}
            />
            <div className={`absolute top-3 text-amber-400 ${lang === "ar" ? "left-3" : "right-3"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Prix */}
        <div className="p-5 bg-gray-50 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="w-full sm:w-1/2 space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                        {t("addAnnonce.price")}
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="0"
                            className="w-full rounded-xl border-gray-200 pl-4 pr-12 py-3 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            min={0}
                        />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">UM</span>
                    </div>
                </div>

                 <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white transition-colors">
                    <div className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isPriceHidden}
                            onChange={(e) => setIsPriceHidden(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700 transition-colors">
                        {t("addAnnonce.hidePrice") ?? "Cacher le prix"}
                    </span>
                </label>
            </div>
        </div>


        {/* ➜ PARTIE SAMSAR */}
        {isSamsar && (
          <fieldset
            className={`border rounded-2xl p-5 ${
              errors.directNegotiation ? "border-red-200 bg-red-50" : "border-gray-200 bg-blue-50/30"
            }`}
          >
            <legend className={`px-2 text-sm font-semibold ${errors.directNegotiation ? "text-red-600" : "text-primary-800"}`}>
              {t("addAnnonce.positionLegend") ?? "Votre position"}
            </legend>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                 {[
                        { val: "owner", label: t("addAnnonce.owner") ?? "Propriétaire", icon: "👤" },
                        { val: "broker", label: t("addAnnonce.broker") ?? "Courtier", icon: "🤝" },
                        { val: "other", label: t("addAnnonce.other"), icon: "ℹ️" },
                 ].map((opt) => (
                    <label key={opt.val} className={`
                            flex-1 cursor-pointer border rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-all
                            ${position === opt.val 
                                ? "bg-white border-primary-500 shadow-sm text-primary-700 ring-1 ring-primary-500" 
                                : "bg-white/50 border-gray-200 text-gray-600 hover:bg-white"}
                        `}>
                         <input
                            type="radio"
                            name="position"
                            value={opt.val}
                            checked={position === opt.val}
                            onChange={() => setPosition(opt.val as any)}
                            className="hidden"
                          />
                          <span>{opt.icon}</span>
                          <span>{opt.label}</span>
                    </label>
                 ))}
            </div>

            {position === "broker" && (
              <div className="mt-6 pt-4 border-t border-gray-200/50">
                <span className="block text-sm font-medium text-gray-700 mb-3">
                  {t("addAnnonce.directQ")}
                </span>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${directNegotiation === true ? "border-primary-600 bg-primary-600" : "border-gray-300"}`}>
                         {directNegotiation === true && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <input
                      type="radio"
                      name="directNegotiation"
                      value="yes"
                      checked={directNegotiation === true}
                      onChange={() => setDirectNegotiation(true)}
                      className="hidden"
                    />
                    <span className="text-gray-700 font-medium">{t("common.yes")}</span>
                  </label>
                  
                   <label className="inline-flex items-center gap-2 cursor-pointer">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${directNegotiation === false ? "border-primary-600 bg-primary-600" : "border-gray-300"}`}>
                         {directNegotiation === false && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <input
                      type="radio"
                      name="directNegotiation"
                      value="no"
                      checked={directNegotiation === false}
                      onChange={() => setDirectNegotiation(false)}
                      className="hidden"
                    />
                    <span className="text-gray-700 font-medium">{t("common.no") ?? "Non"}</span>
                  </label>
                </div>

                {errors.directNegotiation && (
                  <p className="text-red-500 text-xs font-medium mt-2">
                    {t("addAnnonce.needDirectChoice") ?? "Requis*"}
                  </p>
                )}
              </div>
            )}
          </fieldset>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-primary-200 hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>{t("common.next")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
