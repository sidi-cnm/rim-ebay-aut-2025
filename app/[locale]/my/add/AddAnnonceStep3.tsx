// app/[locale]/my/add/AddAnnonceStep3.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useI18n } from "../../../../locales/client";

type Lieu = {
  id: number;
  name: string;
  nameAr: string;
};

type Props = {
  lang?: string;
  annonceId: string;
  /** ex: `/${lang}/p/api/tursor/lieux`  */
  lieuxApiBase: string;
  /** ex: `/${lang}/api/my/annonces/<id>` (PUT) */
  updateAnnonceEndpoint: string;

  onBack: () => void;
  onFinish?: () => void; // optionnel : si tu veux faire autre chose après save
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

  // ---------- 1) Charger les wilayas ----------
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
        // data : { ok: true, data: [...] }
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

  // ---------- 2) Charger les moughataas quand wilaya change ----------
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
        setSelectedMoughataaId(""); // reset la sélection enfant
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

  // ---------- 3) Sauvegarder dans l’annonce ----------
  const handleSave = async () => {
    if (
      selectedWilayaId === "" ||
      selectedMoughataaId === "" ||
      selectedWilayaId == null ||
      selectedMoughataaId == null
    ) {
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
      // On enregistre dans l’annonce. Adapte les champs si besoin :
      // ici on stocke wilayaId / moughataaId + les libellés FR/AR.
      const payload = {
        wilayaId: String(wilaya.id),
        wilayaStr: wilaya.name,
        wilayaStrAr: wilaya.nameAr,
        moughataaId: String(moughataa.id),
        moughataaStr: moughataa.name,
        moughataaStrAr: moughataa.nameAr,
        // pour compat : si tu utilises (lieuId / lieuStr)
        // lieuId: String(moughataa.id),
        // lieuStr: moughataa.name,
        // lieuStrAr: moughataa.nameAr,
      };

      const res = await fetch(updateAnnonceEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("update failed");

      toast.success(t("step3.toasts.saved"), { id: loading });

      // Redirection vers la liste
      router.push(`/${lang}/my/list`);
      router.refresh();

      // callback optionnelle si tu en veux
      onFinish?.();
    } catch {
      toast.error(t("step3.toasts.saveError"), { id: loading });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl" dir={isRTL ? "rtl" : "ltr"}>
      <Toaster position="bottom-right" />
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {t("step3.title")}
      </h2>

      {/* WILAYA */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("step3.wilaya")}
        </label>
        <select
          value={selectedWilayaId}
          onChange={(e) =>
            setSelectedWilayaId(e.target.value ? Number(e.target.value) : "")
          }
          disabled={loadingWilayas}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">
            {loadingWilayas ? "…" : t("step3.wilayaPlaceholder")}
          </option>
          {wilayas.map((w) => (
            <option key={w.id} value={w.id}>
              {isRTL ? w.nameAr : w.name}
            </option>
          ))}
        </select>
      </div>

      {/* MOUGHATAA */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("step3.moughataa")}
        </label>
        <select
          value={selectedMoughataaId}
          onChange={(e) =>
            setSelectedMoughataaId(e.target.value ? Number(e.target.value) : "")
          }
          disabled={loadingMoughataas || selectedWilayaId === ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">
            {loadingMoughataas ? "…" : t("step3.moughataaPlaceholder")}
          </option>
          {moughataas.map((m) => (
            <option key={m.id} value={m.id}>
              {isRTL ? m.nameAr : m.name}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-500 mb-4">{t("step3.hint")}</p>

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded border px-4 py-2 hover:bg-gray-50"
        >
          {isRTL ? "رجوع" : "Retour"}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded bg-blue-900 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? t("step3.saving") : t("step3.save")}
        </button>
      </div>
    </div>
  );
}
