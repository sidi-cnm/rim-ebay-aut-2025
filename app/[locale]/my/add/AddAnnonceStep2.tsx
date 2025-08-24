"use client";

import React, { useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type UploadResult = { url: string; isMain: boolean };

type Props = {
  lang?: string;
  annonceId: string;
  relavieUrlAnnonce: string; // pas utilisé pour l’upload
  onBack: () => void;
  onFinish: (payload?: { firstImagePath?: string; images?: UploadResult[] }) => void;
};

type LocalImage = { file: File; url: string; isMain?: boolean };

export default function AddAnnonceStep2({
  lang = "ar",
  annonceId,
  relavieUrlAnnonce,
  onBack,
  onFinish,
}: Props) {
  const [images, setImages] = useState<LocalImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isRTL = useMemo(() => lang.startsWith("ar"), [lang]);

  const addFiles = (files: File[]) => {
    const next = files
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, Math.max(0, 8 - images.length))
      .map((f, i) => ({
        file: f,
        url: URL.createObjectURL(f),
        isMain: images.length === 0 && i === 0 && !images.some((im) => im.isMain),
      }));
    setImages((prev) => [...prev, ...next]);
  };

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files || []));
  };

  const setMain = (idx: number) => {
    setImages((prev) => prev.map((im, i) => ({ ...im, isMain: i === idx })));
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      toast.error(lang === "ar" ? "أضف صورة واحدة على الأقل" : "Ajoute au moins une image");
      return;
    }
    setUploading(true);
    const loading = toast.loading(lang === "ar" ? "جاري الرفع..." : "Téléversement...");

    try {
      const fd = new FormData();
      images.forEach((im) => fd.append("files", im.file));
      const mainIndex = images.findIndex((im) => im.isMain);
      fd.append("mainIndex", String(mainIndex >= 0 ? mainIndex : 0));

      const uploadUrl = `/fr/api/images/${annonceId}`;  // URL voulue
      const res = await fetch(uploadUrl, { method: "POST", body: fd });
      const data: { ok?: boolean; firstImagePath?: string; images?: UploadResult[]; error?: string } =
        await res.json().catch(() => ({} as any));

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || (lang === "ar" ? "فشل الرفع" : "Échec de l’upload"));
      }

      toast.success(lang === "ar" ? "تم رفع الصور" : "Images envoyées", { id: loading });

      // 👉 signaler au parent (il fera la redirection vers /{lang}/my/list)
      onFinish({ firstImagePath: data.firstImagePath, images: data.images });
    } catch (e: any) {
      toast.error(e?.message || (lang === "ar" ? "فشل الرفع" : "Échec de l’upload"), { id: loading });
    } finally {
      setUploading(false);
    }
  };

  // “Plus tard” → onFinish() sans payload (le parent redirige)
  const handleFinishClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    onFinish();
  };

  return (
    <div className="mx-auto max-w-4xl" dir={isRTL ? "rtl" : "ltr"}>
      <Toaster position="bottom-right" />
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {lang === "ar" ? "إضافة الصور" : "Ajouter des photos"}
      </h2>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 text-center"
      >
        <p className="mb-3 text-gray-600">
          {lang === "ar" ? "اسحب وافلت الصور هنا" : "Glissez & déposez vos images ici"}
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded bg-blue-900 px-4 py-2 text-white hover:bg-blue-700"
        >
          {lang === "ar" ? "اختيار الصور" : "Choisir des images"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePick}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((im, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden border">
              <img src={im.url} alt={`img-${i}`} className="h-40 w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs flex items-center justify-between px-2 py-1">
                <button
                  onClick={() => setMain(i)}
                  className={`px-2 py-0.5 rounded ${im.isMain ? "bg-green-600" : "bg-white/20"}`}
                >
                  {lang === "ar" ? "الرئيسية" : "Principale"}
                </button>
                <button
                  onClick={() => removeImage(i)}
                  className="px-2 py-0.5 bg-red-600 rounded"
                >
                  {lang === "ar" ? "حذف" : "Suppr."}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded border px-4 py-2 hover:bg-gray-50"
        >
          {lang === "ar" ? "رجوع" : "Retour"}
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleFinishClick}
            className="rounded px-4 py-2 border hover:bg-gray-50"
          >
            {lang === "ar" ? "لاحقًا" : "Plus tard"}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={handleUpload}
            className="rounded bg-blue-900 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {uploading
              ? (lang === "ar" ? "جارٍ الرفع..." : "Envoi...")
              : (lang === "ar" ? "رفع الصور" : "Envoyer les images")}
          </button>
        </div>
      </div>
    </div>
  );
}
