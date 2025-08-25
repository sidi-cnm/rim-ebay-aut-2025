"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useI18n } from "../../../../locales/client";

type Lieu = { id: number; name: string; nameAr: string };

type Props = {
  lang?: string;
  annonceId: string;
  lieuxApiBase: string;
  updateAnnonceEndpoint: string;
  onBack: () => void;
  onFinish?: () => void;
};

export default function AddAnnonceStep3({
  lang = "fr",
  annonceId,
  lieuxApiBase,
  updateAnnonceEndpoint,
  onBack,
  onFinish,
}: Props) {
  const t = useI18n();
  const router = useRouter();
  const isRTL = useMemo(() => lang.startsWith("ar"), [lang]);

  const [wilayas, setWilayas] = useState<Lieu[]>([]);
  const [moughataas, setMoughataas] = useState<Lieu[]>([]);
  const [selectedWilayaId, setSelectedWilayaId] = useState<number | "">("");
  const [selectedMoughataaId, setSelectedMoughataaId] = useState<number | "">("");
  const [loadingWilayas, setLoadingWilayas] = useState(false);
  const [loadingMoughataas, setLoadingMoughataas] = useState(false);
  const [saving, setSaving] = useState(false);

  // Wilayas
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
    return () => {
      ignore = true;
    };
  }, [lieuxApiBase, t]);

  // Moughataas
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
        const res = await fetch(
          `${lieuxApiBase}?parentId=${selectedWilayaId}&tag=moughataa`,
          { cache: "no-store" }
        );
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
    return () => {
      ignore = true;
    };
  }, [selectedWilayaId, lieuxApiBase, t]);

  const handleSave = async () => {
    if (!selectedWilayaId || !selectedMoughataaId) {
      toast.error(t("step3.toasts.needBoth"));
      return;
    }
    const wilaya = wilayas.find((w) => w.id === Number(selectedWilayaId));
    const moughataa = moughataas.find((m) => m.id === Number(selectedMoughataaId));
    if (!wilaya || !moughataa) {
      toast.error(t("step3.toasts.needBoth"));
      return;
    }

    setSaving(true);
    const loading = toast.loading(t("step3.saving"));
    try {
      const payload = {
        wilayaId: String(wilaya.id),
        wilayaStr: wilaya.name,
        wilayaStrAr: wilaya.nameAr,
        moughataaId: String(moughataa.id),
        moughataaStr: moughataa.name,
        moughataaStrAr: moughataa.nameAr,
      };

      const res = await fetch(updateAnnonceEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("update failed");

      toast.success(t("step3.toasts.saved"), { id: loading });
      router.push(`/${lang}/my/list`);
      router.refresh();
      onFinish?.();
    } catch {
      toast.error(t("step3.toasts.saveError"), { id: loading });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Toaster position="bottom-right" />
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">
        {t("step3.title")}
      </h2>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4">
        {/* WILAYA */}
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

        {/* MOUGHATAA */}
        <div className="mb-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {t("step3.moughataa")}
          </label>
          <select
            value={selectedMoughataaId}
            onChange={(e) =>
              setSelectedMoughataaId(e.target.value ? Number(e.target.value) : "")
            }
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

        <p className="text-[11px] sm:text-xs text-gray-500 mb-3 sm:mb-4">
          {t("step3.hint")}
        </p>

        <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto rounded border px-4 py-2 text-sm sm:text-base hover:bg-gray-50"
          >
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
