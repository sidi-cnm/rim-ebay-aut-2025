"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Annonce } from "../../../mytypes/types";
import { useI18n } from "../../../../locales/client";

const FALLBACK_IMG = "/noimage.jpg";

interface AnnonceItemUIProps extends Annonce {
  imageServiceUrl?: string;
  href?: string;
  lang?: string;
}

export default function AnnonceItemUI({
  imageServiceUrl = "https://picsum.photos",
  href = "#",
  lang = "fr",
  ...a
}: AnnonceItemUIProps) {
  const t = useI18n();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const imgUrl =
    a.haveImage && a.firstImagePath
      ? `${imageServiceUrl.replace(/\/$/, "")}/${a.firstImagePath.replace(/^\//, "")}`
      : FALLBACK_IMG;

  const created = a.createdAt ? new Date(a.createdAt) : null;
  const pad = (n: number) => String(n).padStart(2, "0");
  const humanDate =
    created && !isNaN(created.getTime())
      ? `${pad(created.getDate())}-${pad(created.getMonth() + 1)}-${created.getFullYear()}`
      : "";

  const goToDetails = () => {
    if (loading) return;
    setLoading(true);
    router.push(href);
  };

  return (
    <article
      data-cy="annonce-item"
      dir={dir}
      className={`group bg-white rounded-2xl shadow-md ring-1 ring-gray-200 overflow-hidden 
                  h-full flex flex-col transition hover:shadow-lg hover:ring-gray-300 ${lang === "ar" ? "text-right" : ""}`}
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/10] bg-gray-100">
        <img
          src={imgUrl}
          alt={a.title ?? (lang === "ar" ? "صورة الإعلان" : "Image annonce")}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Contenu */}
      <div className="p-4 md:p-5 flex flex-col gap-3 flex-1">
        <h2 className="text-base md:text-lg font-semibold leading-tight line-clamp-1">
          {a.title}
        </h2>

        <p className="text-gray-600 text-sm line-clamp-2">{a.description}</p>

        {humanDate && (
          <div className="text-xs text-gray-400">
            {t("card.published")} {humanDate}
          </div>
        )}

        <div className="border-t border-gray-200" />

        {/* Prix */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">{t("card.price")}</span>
          <span className="text-xl md:text-2xl font-extrabold text-green-700 tracking-tight">
            {a.price} <span className="text-sm font-semibold">{t("card.currency")}</span>
          </span>
        </div>

        {/* Bouton DÉTAILS avec loader */}
        <div className="mt-4 w-full">
          <button
            onClick={goToDetails}
            disabled={loading}
            className="relative flex w-full items-center justify-center
                       px-6 py-3 rounded-lg
                       bg-blue-800 text-white font-semibold text-base
                       border border-blue-700
                       shadow-md transition-transform
                       hover:bg-blue-700 hover:scale-105 hover:shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       disabled:opacity-70 disabled:cursor-not-allowed"
            aria-busy={loading}
            aria-live="polite"
          >
            {/* spinner Tailwind */}
            {loading && (
               <span
               aria-hidden="true"
               className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                          inline-block h-5 w-5 rounded-full
                          border-2 border-white/40 border-t-white animate-spin"
             />
            )}
            <span className={loading ? "opacity-0" : "opacity-100"}>
              {t("card.details")}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
