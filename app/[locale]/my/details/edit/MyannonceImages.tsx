"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useI18n } from "../../../../../locales/client";
import toast, { Toaster } from "react-hot-toast";




export type MyAnnonceImagesProps = {
    imagesUrl: string[];         // 👈 le nom attendu par le parent
    title?: string;
    editable?: boolean;
    onAddFiles?: (files: File[]) => void;
    onRemove?: (index: number) => void;
  };

export default function MyAnnonceImages({
    imagesUrl,
    title,
    editable = true,
    onAddFiles,
    onRemove,
}: MyAnnonceImagesProps) {
 
  const t = useI18n();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const openPicker = () => inputRef.current?.click();

  const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {

    toast.loading("loading ....");

    const files = Array.from(e.target.files || []);
    if (files.length && onAddFiles) onAddFiles(files);

    toast.success("Image ajoutés");
    // reset pour permettre le même fichier à nouveau
    e.currentTarget.value = "";
  };

  const handleRemove = (idx: number) => {
    toast.loading("deleting .....")
    if (onRemove) onRemove(idx);
    toast.remove("removed")
  };

  return (
    <section className="w-full">
      {/* Header */}
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            {title ?? t("editForm.images") }
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {t("editForm.images")}
          </p>
        </div>

        {editable && (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePick}
            />
            <button
              onClick={openPicker}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {t("editForm.addimages")}
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      {imagesUrl?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {imagesUrl.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              {/* image */}
              <button
                type="button"
                onClick={() => setPreviewUrl(url)}
                className="block w-full cursor-zoom-in"
                title={t("editForm.preview") ?? "Prévisualiser"}
              >
                {/* next/image garde le ratio et optimise le chargement */}
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={url}
                    alt={`annonce-img-${idx}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    unoptimized={url.startsWith("blob:") || url.startsWith("data:")}
                  />
                </div>
              </button>

              {/* barre bas / overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

              {/* actions */}
              {editable && (
                <div className="absolute bottom-2 inset-x-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="pointer-events-auto inline-flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-red-700 shadow hover:bg-white"
                    title={t("editForm.delete")}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a2 2 0 012-2h2a2 2 0 012 2m-6 0h6"
                      />
                    </svg>
                    {t("editForm.delete")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-6 w-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16l5-5 4 4 8-8" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">
            {t("editForm.noPhotos") ?? "Aucune photo pour le moment."}
          </p>
          {editable && (
            <div className="mt-4">
              <button
                onClick={openPicker}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {t("editForm.addimages")}
              </button>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePick}
          />
        </div>
      )}

      {/* Modal Preview */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-3 -right-3 z-10 rounded-full bg-white/95 p-2 text-gray-700 shadow hover:bg-white"
              aria-label={t("editForm.close") ?? "Fermer"}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black">
              <Image
                src={previewUrl}
                alt="preview"
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized={previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
