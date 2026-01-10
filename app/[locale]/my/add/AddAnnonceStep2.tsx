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
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">
        {lang === "ar" ? "إضافة الصور" : "Ajouter des photos"}
      </h2>
      <p className="text-gray-500 mb-6">
        {lang === "ar" ? "أضف صوراً واضحة لزيادة فرص البيع (اختياري)" : "Ajoutez des photos claires pour augmenter vos chances de vente (optionnel)"}
      </p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="group relative rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center transition-all hover:bg-primary-50/50 hover:border-primary-300"
      >
        <div className="mb-4 flex justify-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm text-3xl">📸</span>
        </div>
        <p className="mb-4 text-gray-600 font-medium group-hover:text-primary-700">
          {lang === "ar" ? "اسحب وافلت الصور هنا" : "Glissez & déposez vos images ici"}
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 font-bold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5"
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
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((im, i) => (
            <div key={i} className={`relative group rounded-2xl overflow-hidden border-2 transition-all ${im.isMain ? 'border-green-500 ring-2 ring-green-500/20' : 'border-gray-100 hover:border-gray-300'}`}>
              <div className="aspect-square relative">
                  <img src={im.url} alt={`img-${i}`} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                 <div className="flex justify-end">
                    <button
                      onClick={() => removeImage(i)}
                      className="bg-white/90 text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title={lang === "ar" ? "حذف" : "Supprimer"}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                 </div>
                 
                 <button
                    onClick={() => setMain(i)}
                    className={`w-full py-1.5 text-xs font-bold rounded-lg backdrop-blur-sm transition-colors ${
                        im.isMain 
                        ? "bg-green-500 text-white cursor-default"
                        : "bg-white/90 text-gray-700 hover:bg-white"
                    }`}
                  >
                    {im.isMain 
                        ? (lang === "ar" ? "الرئيسية" : "Image principale") 
                        : (lang === "ar" ? "تعيين كرئيسية" : "Définir principale")}
                  </button>
              </div>
              
              {/* Badge for main image always visible */}
              {im.isMain && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                      ★ {lang === "ar" ? "الرئيسية" : "Principale"}
                  </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-gray-200 px-6 py-3 font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          {lang === "ar" ? "رجوع" : "Retour"}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-xl bg-primary-600 px-8 py-3 font-bold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5"
        >
          {lang === "ar" ? "التالي" : "Suivant"}
        </button>
      </div>
      </div>
    </div>
  );
}
