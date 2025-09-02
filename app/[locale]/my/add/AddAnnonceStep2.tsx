// app/[locale]/my/add/AddAnnonceStep2.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  lang?: string;
  onBack: () => void;
  onNext: (payload: { images: File[]; mainIndex: number }) => void;
  initial?: { images?: File[]; mainIndex?: number };
};

type LocalImage = { file: File; url: string; isMain?: boolean };

export default function AddAnnonceStep2({
  lang = "ar",
  onBack,
  onNext,
  initial,
}: Props) {
  const isRTL = useMemo(() => lang.startsWith("ar"), [lang]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<LocalImage[]>(
    (initial?.images || []).map((f, i) => ({
      file: f,
      url: URL.createObjectURL(f),
      isMain: initial?.mainIndex != null ? i === initial.mainIndex : i === 0,
    }))
  );

  // Libère les objectURLs à l’unmount
  useEffect(() => {
    return () => {
      images.forEach((im) => {
        try {
          URL.revokeObjectURL(im.url);
        } catch {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = (files: File[]) => {
    const next: LocalImage[] = files
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, Math.max(0, 8 - images.length))
      .map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
        isMain: false, // force la présence du champ pour le typing
      }));

    const hasMain = images.some((im) => im.isMain);
    const merged: LocalImage[] = [...images, ...next];

    if (!hasMain && merged.length > 0) merged[0].isMain = true;

    setImages(merged);
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
    setImages((prev) => {
      const toRemove = prev[idx];
      try {
        URL.revokeObjectURL(toRemove.url);
      } catch {}

      const nxt = prev.filter((_, i) => i !== idx);
      if (!nxt.some((im) => im.isMain) && nxt[0]) nxt[0].isMain = true;
      return nxt;
    });
  };

  const handleNext = () => {
    // 🔸 Images optionnelles : on laisse passer même si la liste est vide
    const mainIndex = Math.max(0, images.findIndex((im) => im.isMain));
    onNext({ images: images.map((im) => im.file), mainIndex });
  };

  return (
    <div className="mx-auto max-w-4xl" dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="text-2xl font-semibold mb-1 text-gray-800">
        {lang === "ar" ? "إضافة الصور" : "Ajouter des photos"}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {lang === "ar" ? "(اختياري)" : "(optionnel)"}
      </p>

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
        <button
          type="button"
          onClick={handleNext}
          className="rounded bg-blue-900 px-5 py-2 font-semibold text-white hover:bg-blue-700"
        >
          {lang === "ar" ? "التالي" : "Suivant"}
        </button>
      </div>
    </div>
  );
}
