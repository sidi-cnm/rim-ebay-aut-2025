"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useI18n  } from "../../../../../../locales/client";


export type MyAnnonceImagesProps = {
  imagesUrl: string[];
  title?: string;
  onAddFiles?: (files: File[]) => void;
  onRemove?: (index: number) => void;
};

export default function MyAnnonceImages({
  imagesUrl,
  title,
  onAddFiles,
  onRemove,
}: MyAnnonceImagesProps) {
  const t = useI18n();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => inputRef.current?.click();

  const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target?.files || []);
    if (files.length && onAddFiles) onAddFiles(files);
    e.currentTarget.value = ""; // reset pour permettre re-sélection
  };

  return (
    <section className="px-3 sm:px-4 py-5">

      {/* Carte centrée */}
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-gray-200 bg-white shadow-md">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between p-4 sm:p-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              {title ?? t("editForm.images")}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{t("editForm.images")}</p>
          </div>

          {/* Ajouter des images */}
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
        </div>

        {/* Grille des images */}
        {imagesUrl && imagesUrl.length > 0 ? (
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagesUrl.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* image */}
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={url}
                      alt={`annonce-img-${idx}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized
                    />
                  </div>

                  {/* bouton supprimer TOUJOURS visible */}
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => onRemove?.(idx)}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-red-700 shadow hover:bg-white"
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
                </div>
              ))}
            </div>
          </div>
        ) : (
          // État vide
          <div className="p-6 text-center">
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
      </div>
    </section>
  );
}
