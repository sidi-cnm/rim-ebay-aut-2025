"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useI18n } from "../../../../locales/client";
import { sendTelegramMessage } from "../../../../Telegramboot/main";

const url = process.env.SITE_BASE_URL

type Lieu = { id: number; name: string; nameAr: string };

type Props = {
  lang?: string;
  lieuxApiBase: string;             // `/${lang}/p/api/tursor/lieux`
  createAnnonceEndpoint: string;    // `/${lang}/api/annonces`
  urlboot: string;               // `/${lang}/api/telegram`
  onBack: () => void;
  draft: {
    typeAnnonceId?: string;
    categorieId?: string;
    subcategorieId?: string;
    title?: string;
    description?: string;
    price?: number | null;
    images?: File[];
    mainIndex?: number;
    lieuId?: string;
    moughataaId?: string;
    directNegotiation?: boolean | null;
    classificationFr?: string;
    classificationAr?: string;
    isSamsar?: boolean;
    rentalPeriod?: string | null;
    rentalPeriodAr?: string | null;
    typeAnnonceName?: string;
    categorieName?: string;
    typeAnnonceNameAr?: string;
    categorieNameAr?: string;
    isPriceHidden?: boolean;
    privateDescription?: string;
  };
};

export default function AddAnnonceStep3({
  lang = "fr",
  lieuxApiBase,
  createAnnonceEndpoint,
  onBack,
  draft,
  urlboot,
}: Props) {
  const t = useI18n();
  const router = useRouter();
  const isRTL = useMemo(() => lang.startsWith("ar"), [lang]);

  // console.log("process : " ,process.env.SITE_BASE_URL)
  // console.log("url : " , url)
  
  const [wilayas, setWilayas] = useState<Lieu[]>([]);
  const [moughataas, setMoughataas] = useState<Lieu[]>([]);
  const [selectedWilayaId, setSelectedWilayaId] = useState<number | "">(
    draft.lieuId ? Number(draft.lieuId) : ""
  );
  const [selectedMoughataaId, setSelectedMoughataaId] = useState<number | "">(
    draft.moughataaId ? Number(draft.moughataaId) : ""
  );
  const [loadingWilayas, setLoadingWilayas] = useState(false);
  const [loadingMoughataas, setLoadingMoughataas] = useState(false);
  const [saving, setSaving] = useState(false);

  console.log("🚀 urlboot reçu dans AddAnnonceStep3:", urlboot);

 
  // Charger wilayas
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoadingWilayas(true);
        const res = await fetch(`${lieuxApiBase}?tag=wilaya`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (ignore) return;
        if (!res.ok || data?.ok === false) {
          toast.error(t("step3.toasts.loadWilayasError"));
          setWilayas([]);
          return;
        }
        setWilayas(Array.isArray(data?.data) ? data.data : []);
      } catch {
        toast.error(t("step3.toasts.loadWilayasError"));
      } finally {
        setLoadingWilayas(false);
      }
    })();
    return () => { ignore = true; };
  }, [lieuxApiBase, t]);

  // Charger moughataas quand wilaya change
  useEffect(() => {
    if (selectedWilayaId === "" || selectedWilayaId == null) {
      setMoughataas([]);
      setSelectedMoughataaId("");
      return;
    }
    let ignore = false;
    (async () => {
      try {
        setLoadingMoughataas(true);
        const res = await fetch(`${lieuxApiBase}?parentId=${selectedWilayaId}&tag=moughataa`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (ignore) return;
        if (!res.ok || data?.ok === false) {
          toast.error(t("step3.toasts.loadMoughataasError"));
          setMoughataas([]);
          setSelectedMoughataaId("");
          return;
        }
        setMoughataas(Array.isArray(data?.data) ? data.data : []);
        setSelectedMoughataaId("");
      } catch {
        toast.error(t("step3.toasts.loadMoughataasError"));
        setMoughataas([]);
        setSelectedMoughataaId("");
      } finally {
        setLoadingMoughataas(false);
      }
    })();
    return () => { ignore = true; };
  }, [selectedWilayaId, lieuxApiBase, t]);

  // POST unique (multipart)
  const handleSave = async () => {
    if (!selectedWilayaId || !selectedMoughataaId) {
      toast.error(t("step3.toasts.needBoth"));
      return;
    }
    // Validation assouplie côté client
    if (!draft.typeAnnonceId || !draft.description) {
      toast.error(t("errors.requiredFields"));
      return;
    }

    setSaving(true);
    const loading = toast.loading(t("step3.saving"));
    try {
      const fd = new FormData();
      // step1
      fd.append("typeAnnonceId", String(draft.typeAnnonceId));
      if (draft.categorieId)    fd.append("categorieId", String(draft.categorieId));
      if (draft.subcategorieId) fd.append("subcategorieId", String(draft.subcategorieId));

      fd.append("title", String(draft.title ?? (draft.description ?? "").slice(0, 50)));
      fd.append("description", String(draft.description ?? ""));

      if (typeof draft.directNegotiation === "boolean") {
        fd.append("directNegotiation", draft.directNegotiation ? "true" : "false");
      }
      if (draft.price != null) fd.append("price", String(draft.price));
      if (draft.classificationFr) fd.append("classificationFr", String(draft.classificationFr));
      if (draft.classificationAr) fd.append("classificationAr", String(draft.classificationAr));
      fd.append("issmar", draft.isSamsar ? "true" : "false");
      if (draft.rentalPeriod) fd.append("rentalPeriod", String(draft.rentalPeriod));
      if (draft.rentalPeriodAr) fd.append("rentalPeriodAr", String(draft.rentalPeriodAr));
      if(draft.categorieName) fd.append("categorieName", String(draft.categorieName));
      if(draft.typeAnnonceName) fd.append("typeAnnonceName", String(draft.typeAnnonceName));
      if(draft.categorieNameAr) fd.append("categorieNameAr", String(draft.categorieNameAr));
      if(draft.typeAnnonceNameAr) fd.append("typeAnnonceNameAr", String(draft.typeAnnonceNameAr));
      if (draft.isPriceHidden) fd.append("isPriceHidden", "true");
      if (draft.privateDescription) fd.append("privateDescription", draft.privateDescription);
      
      // step3 (lieu)
      fd.append("lieuId", String(selectedWilayaId));
      fd.append("moughataaId", String(selectedMoughataaId));

      const selectedWilaya = wilayas.find(w => w.id === Number(selectedWilayaId));
      const selectedMoughataa = moughataas.find(m => m.id === Number(selectedMoughataaId));

      if (selectedWilaya) {
        fd.append("lieuStr", selectedWilaya.name);
        fd.append("lieuStrAr", selectedWilaya.nameAr);
      }
      if (selectedMoughataa) {
        fd.append("moughataaStr", selectedMoughataa.name);
        fd.append("moughataaStrAr", selectedMoughataa.nameAr);
      }

      // step2 (images)
      const files = draft.images ?? [];
      files.forEach((file) => fd.append("files", file));
      fd.append("mainIndex", String(Math.max(0, draft.mainIndex ?? 0)));

      // flags
      fd.append("status", "active");
      fd.append("haveImage", String(files.length > 0));

      const res = await fetch(createAnnonceEndpoint, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(data?.error || "Create failed");

      // console.log("Annonce created:", data.id);

      const ress = await fetch(
        `${urlboot}?msg=admin-rim.vercel.app/annonces/${data?.id}`,
        { method: "GET" }
      );
      
      console.log("Telegram API response:", ress);

      toast.success(t("step3.toasts.saved"), { id: loading });

      

      router.push(`/${lang}/my/list`);
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || t("step3.toasts.saveError"), { id: loading });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl" dir={isRTL ? "rtl" : "ltr"}>
      <Toaster position="bottom-right" />
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
                {t("step3.title")}
            </h2>
            <p className="text-gray-500">
                {isRTL ? "حدد موقع العقار بدقة لمساعدة المشترين في العثور عليه" : "Précisez l'emplacement de votre bien pour aider les acheteurs à le trouver"}
            </p>
        </div>

      <div className="space-y-6">
        {/* Wilaya sort of grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wilaya */}
            <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
                {t("step3.wilaya")}
            </label>
            <div className="relative">
                <select
                    value={selectedWilayaId}
                    onChange={(e) => setSelectedWilayaId(e.target.value ? Number(e.target.value) : "")}
                    disabled={loadingWilayas}
                    className={`w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 text-base text-gray-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all disabled:opacity-50 ${isRTL ? "pl-10 pr-4" : "pl-4 pr-10"}`}
                >
                    <option value="">{loadingWilayas ? "..." : t("step3.wilayaPlaceholder")}</option>
                    {wilayas.map((w) => (
                    <option key={w.id} value={w.id}>
                        {isRTL ? w.nameAr : w.name}
                    </option>
                    ))}
                </select>
                <div className={`pointer-events-none absolute inset-y-0 flex items-center px-4 text-gray-500 ${isRTL ? "left-0" : "right-0"}`}>
                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            </div>

            {/* Moughataa */}
            <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
                {t("step3.moughataa")}
            </label>
            <div className="relative">
                <select
                    value={selectedMoughataaId}
                    onChange={(e) => setSelectedMoughataaId(e.target.value ? Number(e.target.value) : "")}
                    disabled={loadingMoughataas || selectedWilayaId === ""}
                    className={`w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 text-base text-gray-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all disabled:opacity-50 ${isRTL ? "pl-10 pr-4" : "pl-4 pr-10"}`}
                >
                    <option value="">{loadingMoughataas ? "..." : t("step3.moughataaPlaceholder")}</option>
                    {moughataas.map((m) => (
                    <option key={m.id} value={m.id}>
                        {isRTL ? m.nameAr : m.name}
                    </option>
                    ))}
                </select>
                <div className={`pointer-events-none absolute inset-y-0 flex items-center px-4 text-gray-500 ${isRTL ? "left-0" : "right-0"}`}>
                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
             <span className="text-xl">💡</span>
             <p className="text-sm text-blue-800 leading-relaxed">{t("step3.hint")}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-8 border-t border-gray-100">
          <button 
                type="button" 
                onClick={onBack} 
                className="w-full sm:w-auto rounded-xl border border-gray-200 px-6 py-3 font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            {isRTL ? "رجوع" : "Retour"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="flex-1 rounded-xl bg-primary-600 px-8 py-3 font-bold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
             {saving ? (
                 <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    <span>{t("step3.saving")}</span>
                 </>
             ) : (
                 <>
                    <span>✓</span>
                    <span>{t("step3.save")}</span>
                 </>
             )}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
