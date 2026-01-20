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

  const imgUrl = a.haveImage && a.firstImagePath ? `${a.firstImagePath}` : FALLBACK_IMG;

  
  // description shortening the text if too long for better display and it is comatible with both languages
  const description = a.description.length > 60 ? a.description.slice(0, 57) + "..." : a.description;

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

  // console.log("sponsored:", a.isSponsored);

  const hasLocation = a.lieuStr && a.lieuStrAr && a.moughataaStr && a.moughataaStrAr;

  let location = "";
  if(hasLocation) {
    location = lang === "ar" ? `${a.lieuStrAr}/${a.moughataaStrAr}` : `${a.lieuStr}/${a.moughataaStr}`;
  }

  return (
    <article
      data-cy="annonce-item"
      dir={dir}
      onClick={goToDetails}
      className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
    >
      {/* Image + bouton favori */}
      <Toaster position="top-right" />
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-2xl">
        <img
          src={imgUrl}
          alt={a.title ?? t("card.altImage")}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Featured badge (if sponsored) */}
        {a.isSponsored && (
          <span
            className={`absolute top-2 ${lang === "ar" ? "right-2" : "left-2"}
                       bg-white/95 backdrop-blur text-amber-600 
                       text-[10px] font-bold uppercase tracking-wider
                       px-2 py-0.5 rounded-full shadow-sm
                       z-20`}
          >
           {lang === "ar" ? "مُميّز" : "Sponsored"}
          </span>
        )}

        {/* ❤️ bouton cœur */}
        <button
          type="button"
          onClick={onToggleFavorite}
          disabled={favLoading}
          className={`absolute top-2 ${lang === "ar" ? "left-2" : "right-2"} 
                      z-20 grid place-items-center
                      w-8 h-8 rounded-full
                      bg-white/80 hover:bg-white backdrop-blur-md
                      text-gray-500 hover:text-red-500
                      transition-all duration-200 shadow-sm`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 transition-colors ${isFav ? "fill-rose-500 text-rose-500" : "fill-none"}`}
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.04-4.5-4.556-4.5-1.61 0-3.022.86-3.944 2.158A4.973 4.973 0 0 0 8.556 3.75C6.04 3.75 4 5.765 4 8.25c0 6.056 8 10.5 8 10.5s9-4.444 9-10.5Z"
            />
          </svg>
        </button>
        
        {/* Overlay PRICE on Image (Minimalist Trend) */}
        {a.isPriceHidden === false && (
             <div className={`absolute bottom-2 ${lang === "ar" ? "right-2" : "left-2"} z-20`}>
                 <div className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm">
                   <div className="flex items-baseline gap-1 text-gray-900">
                     <span className="text-sm font-extrabold">{a.price?.toLocaleString()}</span>
                     <span className="text-[10px] font-bold text-gray-500">{t("card.currency")}</span>
                   </div>
                 </div>
             </div>
        )}
      </div>

      {/* Contenu */}
      <div className="pt-3 px-1 flex flex-col gap-1.5 flex-1">
        {/* Title */}
        <h2 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2.5em]">
          {description}
        </h2>
        
        {/* Meta: Location */}
         <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
           <span>{humanDate}</span>
         </div>
      </div>
    </article>
  );
}
