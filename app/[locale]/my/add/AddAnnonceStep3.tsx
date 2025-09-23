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
      
      // step3 (lieu)
      fd.append("lieuId", String(selectedWilayaId));
      fd.append("moughataaId", String(selectedMoughataaId));

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
    <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl" dir={isRTL ? "rtl" : "ltr"}>
      <Toaster position="bottom-right" />
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">
        {t("step3.title")}
      </h2>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4">
        {/* Wilaya */}
        <div className="mb-3">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {t("step3.wilaya")}
          </label>
          <select
            value={selectedWilayaId}
            onChange={(e) => setSelectedWilayaId(e.target.value ? Number(e.target.value) : "")}
            disabled={loadingWilayas}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">{loadingWilayas ? "…" : t("step3.wilayaPlaceholder")}</option>
            {wilayas.map((w) => (
              <option key={w.id} value={w.id}>
                {isRTL ? w.nameAr : w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Moughataa */}
        <div className="mb-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {t("step3.moughataa")}
          </label>
          <select
            value={selectedMoughataaId}
            onChange={(e) => setSelectedMoughataaId(e.target.value ? Number(e.target.value) : "")}
            disabled={loadingMoughataas || selectedWilayaId === ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">{loadingMoughataas ? "…" : t("step3.moughataaPlaceholder")}</option>
            {moughataas.map((m) => (
              <option key={m.id} value={m.id}>
                {isRTL ? m.nameAr : m.name}
              </option>
            ))}
          </select>
        </div>

        <p className="text-[11px] sm:text-xs text-gray-500 mb-3 sm:mb-4">{t("step3.hint")}</p>

        <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button type="button" onClick={onBack} className="w-full sm:w-auto rounded border px-4 py-2 text-sm sm:text-base hover:bg-gray-50">
            {isRTL ? "رجوع" : "Retour"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="w-full sm:w-auto rounded bg-blue-900 px-5 py-2 text-sm sm:text-base font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? t("step3.saving") : t("step3.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
