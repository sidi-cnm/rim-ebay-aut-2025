"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Annonce } from "../../../mytypes/types";
import { useI18n } from "../../../../locales/client";
import toast, { Toaster } from "react-hot-toast";

const FALLBACK_IMG = "/noimage.jpg";

interface AnnonceItemUIProps extends Annonce {
  imageServiceUrl?: string;
  href?: string;
  lang?: string;
  isFavorite?: boolean;
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
  const [favLoading, setFavLoading] = useState(false);
  const [isFav, setIsFav] = useState<boolean>(Boolean(a.isFavorite));

  const imgUrl =
    a.haveImage && a.firstImagePath ? `${a.firstImagePath}` : FALLBACK_IMG;

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

  const selfAlign = lang === "ar" ? "self-end" : "self-start";

  // ✅ appel API + toast
  const onToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (favLoading) return;
    const next = !isFav;
    setIsFav(next); // MAJ optimiste
    setFavLoading(true);

    try {
      const res = await fetch(`/${lang}/api/my/annonces/${a.id}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isFavorite: next }),
      });

      if (res.status === 401) {
        setIsFav(!next);
        toast.error(t("card.loginRequired"));
        return;
      }

      if (!res.ok) {
        setIsFav(!next);
        toast.error(t("card.updateError"));
      } else {
        toast.success(
          next ? t("card.addFavorite") : t("card.removeFavorite")
        );
      }
    } catch {
      setIsFav(!next);
      toast.error(t("card.updateError"));
    } finally {
      setFavLoading(false);
    }
  };

  console.log("sponsored:", a.isSponsored);

  return (
    <article
      data-cy="annonce-item"
      dir={dir}
      className={`group bg-white rounded-2xl shadow-md ring-1 ring-gray-200 
                  flex flex-col transition hover:shadow-lg hover:ring-gray-300 ${
                    lang === "ar" ? "text-right" : ""
                  }`}
    >
      {/* Image + bouton favori */}
      <Toaster position="top-right" />
      <div className="relative w-full h-48 md:h-56 lg:h-64 bg-gray-100 overflow-hidden rounded-t-2xl">
        <img
          src={imgUrl}
          alt={a.title ?? t("card.altImage")}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* ✅ Ruban SPONSORISÉ */}
        {a.isSponsored && (
          <div
            className={`absolute top-2 
                       mx-auto left-0 
                      w-40 rotate-[-45deg] 
                      bg-red-600
                      text-white font-bold text-xs uppercase
                      text-center py-1 shadow-lg
                      ring-1 ring-red-900
                      rounded-sm
                      px-2
                      z-20 isolate`}
          >
           {lang === "ar" ? "مُموّل" : "SPONSORISÉ"}
          </div>
        )}

        {/* ❤️ bouton cœur */}
        <button
          type="button"
          onClick={onToggleFavorite}
          disabled={favLoading}
          aria-label={
            isFav ? t("card.removeFavorite") : t("card.addFavorite")
          }
          title={isFav ? t("card.removeTitle") : t("card.addTitle")}
          className={`absolute top-2 ${lang === "ar" ? "left-2" : "right-2"} 
                      z-10 grid place-items-center
                      w-10 h-10 rounded-full
                      bg-white/95 backdrop-blur
                      shadow-md ring-1 ring-gray-300
                      hover:ring-blue-500 hover:scale-105
                      disabled:opacity-70 disabled:cursor-not-allowed
                      transition`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6"
            fill={isFav ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.04-4.5-4.556-4.5-1.61 0-3.022.86-3.944 2.158A4.973 4.973 0 0 0 8.556 3.75C6.04 3.75 4 5.765 4 8.25c0 6.056 8 10.5 8 10.5s9-4.444 9-10.5Z"
              className={isFav ? "text-rose-600" : "text-gray-600"}
            />
          </svg>
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4 md:p-5 flex flex-col items-start gap-3 flex-1">
        {/* Badge classification */}
        <span
          className={`inline-block w-fit max-w-full ${selfAlign}
                      bg-blue-800 rounded-full px-3 py-1
                      text-sm font-semibold text-white mt-2
                      break-words`}
          title={lang === "fr" ? a.classificationFr : a.classificationAr}
        >
          {lang === "fr" ? a.classificationFr : a.classificationAr}
        </span>

        <h2 className="text-base md:text-lg font-semibold leading-tight line-clamp-1">
          {a.description}
        </h2>

        {humanDate && (
          <div className="text-xs text-gray-400">
            {t("card.published")} {humanDate}
          </div>
        )}

        <div className="border-t border-gray-200" />

        {/* Prix */}
        <div className="flex items-center justify-between pt-2 w-full">
          <span className="text-sm text-gray-500">{t("card.price")}</span>
          <span className="text-xl md:text-2xl font-extrabold text-green-700 tracking-tight">
            {a.price}{" "}
            <span className="text-sm font-semibold">{t("card.currency")}</span>
          </span>
        </div>

        {/* ✅ Affichage période de location en mode “draft” */}

                      
      
        {a.rentalPeriod && a.rentalPeriodAr && (
        <div
        className={`inline-flex items-center gap-2
          max-w-[180px] rounded-xl
          border border-yellow-300
         bg-blue-800 text-white font-semibold text-base
          text-center py-1 shadow-lg
          ring-1 ring-red-900
          rounded-sm
          px-2
          z-20 isolate
          ${lang === "ar" ? "self-end text-right" : "self-start text-left"}`}
      >
        <span className="font-semibold">
          {lang === "ar" ? "إيجار" : "Location"}
        </span>
        <span className="font-bold">
          {lang === "ar" ? a.rentalPeriodAr : a.rentalPeriod}
        </span>
      </div>
)}




        {/* Bouton DÉTAILS */}
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
