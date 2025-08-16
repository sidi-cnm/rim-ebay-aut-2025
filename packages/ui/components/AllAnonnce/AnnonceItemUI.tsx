"use client";

import Link from "next/link";
import { Annonce } from "../../../mytypes/types";
import { useI18n } from "../../../../locales/client"; // ⬅️ comme ton AddAnnonceUI

const FALLBACK_IMG = "/noimage.jpg";

interface AnnonceItemUIProps extends Annonce {
  imageServiceUrl?: string;
  href?: string;
  lang?: string; // tu gardes string si tu veux
}

export default function AnnonceItemUI({
  imageServiceUrl = "https://picsum.photos",
  href = "#",
  lang = "fr",
  ...a
}: AnnonceItemUIProps) {
  const t = useI18n();                     // ⬅️ même hook que dans AddAnnonceUI
  const dir = lang === "ar" ? "rtl" : "ltr";

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

  // libellés i18n
  const publishedLabel = t("card.published");
  const priceLabel = t("card.price");         
  const currencyLabel = t("card.currency");   
  const detailsLabel = t("card.details");   

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
            {publishedLabel} {humanDate}
          </div>
        )}

        <div className="border-t border-gray-200" />

        {/* Prix */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">{priceLabel}</span>
          <span className="text-xl md:text-2xl font-extrabold text-green-700 tracking-tight">
            {a.price} <span className="text-sm font-semibold">{currencyLabel}</span>
          </span>
        </div>

        {/* Bouton DÉTAILS */}
        <div className="mt-4 w-full">
          <Link
            href={href}
            className="flex w-full items-center justify-center
                       px-6 py-3 rounded-lg
                       bg-blue-800 text-white font-semibold text-base
                       border border-blue-700
                       shadow-md transition-transform
                       hover:bg-blue-700 hover:scale-105 hover:shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {detailsLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
