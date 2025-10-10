"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Annonce } from "../../../mytypes/types";
import { useI18n } from "../../../../locales/client";

const FALLBACK_IMG = "/noimage.jpg";

// Réponse minimale de /api/images/:id
type ImgDoc = { imagePath: string };

// Images toujours sous forme de tableau (jamais undefined)
type ImageItem = { id: string; imagePath: string };
type ImagesArray = NonNullable<Annonce["images"]>;

export default function AnnonceDetailUI({
  annonceId,
  annonce,
  lang = "fr",
}: {
  annonceId: string;
  annonce: Annonce;
  lang?: string;
}) {
  const t = useI18n();
  const isRTL = (lang || "").startsWith("ar");

  // Copie locale de l’annonce pour merger les images chargées côté client
  const [localAnnonce, setLocalAnnonce] = useState<Annonce>(annonce);


  console.log("AnnonceDetailUI render", localAnnonce );

  
  // Helper: retourne l'URL telle quelle (Blob public)
  const getImageUrl = (imagePath: string) => String(imagePath || "");

  // Normalise ImgDoc[] -> ImagesArray (toujours un tableau)
  const normalizeImages = (arr?: ImgDoc[]): ImagesArray => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    return arr.map((im, i): ImageItem => ({
      id: String(i),
      imagePath: String(im.imagePath || ""),
    }));
  };

  // Charge toutes les images si haveImage vrai et que l'état ne les a pas encore
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        if (!localAnnonce?.haveImage) return;
        if (Array.isArray(localAnnonce?.images) && localAnnonce.images.length > 0) return;

        const url = `/${lang}/api/images/${annonceId}`;
        const res = await fetch(url, { cache: "no-store" });
        const data: {
          images?: ImgDoc[];
          firstImagePath?: string | null;
          haveImage?: boolean;
        } = await res.json().catch(() => ({} as any));

        if (!res.ok || !data || ignore) return;

        const normalized: ImagesArray = normalizeImages(data.images);

        // Fallback : si pas de liste mais une image principale, on crée une entrée
        const fallbackArray: ImagesArray =
          normalized.length === 0 && data.firstImagePath
            ? [{ id: "0", imagePath: String(data.firstImagePath) }]
            : normalized;

        setLocalAnnonce((prev): Annonce => {
          const prevImages: ImagesArray = Array.isArray(prev.images) ? (prev.images as ImagesArray) : [];
          return {
            ...prev,
            haveImage: data.haveImage ?? prev.haveImage,
            firstImagePath: String(data.firstImagePath ?? prev.firstImagePath ?? ""),
            images: fallbackArray.length > 0 ? fallbackArray : prevImages,
          };
        });
      } catch {
        // silencieux
      }
    })();

    return () => {
      ignore = true;
    };
    // ✅ dépend uniquement de l'id et de la langue pour éviter les re-renders qui vident le carousel
  }, [annonceId, lang]); // si tu veux le plus stable possible, remplace par [annonceId, lang]

  // Date
  const d = localAnnonce?.createdAt ? new Date(localAnnonce.createdAt as any) : null;
  const valid = d instanceof Date && !isNaN(d.getTime());
  const formattedDate = valid ? d.toLocaleDateString(isRTL ? "ar-MR" : "fr-FR") : "";
  const formattedTime = valid
    ? d.toLocaleTimeString(isRTL ? "ar-MR" : "fr-FR", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <article
      className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-4 max-w-lg mx-auto my-6 sm:max-w-2xl sm:p-6 md:my-8"
      data-cy="annonce-detail"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h2 className="text-2xl font-bold text-blue-600 text-center">
        {t("detail.title")}
      </h2>

      {/* CARROUSEL agrandi & clipé */}
      {/* 👇 Forcer LTR pour éviter les bugs RTL de react-responsive-carousel */}
      <div className="w-full overflow-hidden rounded-xl" dir="ltr">
        {localAnnonce?.haveImage &&
        Array.isArray(localAnnonce.images) &&
        localAnnonce.images.length > 0 ? (
          <Carousel
            className="rounded-xl"
            infiniteLoop
            autoPlay
            showThumbs={false}
            showStatus={false}
            dynamicHeight={false}
            swipeable
            emulateTouch
            key={`carousel-${lang}-${localAnnonce.images.length}`} // force un remount si langue change
          >
            {localAnnonce.images.map((item, index) => (
              <div key={item.id ?? index} className="w-full">
                <div className="relative w-full h-64 sm:h-80 lg:h-[500px] overflow-hidden rounded-xl bg-gray-50">
                  <img
                    src={getImageUrl(item.imagePath)}
                    alt={localAnnonce.title ?? `image-${index}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="relative w-full h-64 sm:h-80 lg:h-[500px] overflow-hidden rounded-xl bg-gray-100">
            <img
              src={localAnnonce?.firstImagePath || FALLBACK_IMG}
              alt={t("detail.noImageAlt")}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* CONTENU */}
      <div className="p-2">
        <h1 className="text-xl sm:text-2xl font-bold my-2">{localAnnonce.title}</h1>

        <p className="text-gray-600 text-sm sm:text-base mb-4">{localAnnonce.description}</p>

        {/* Prix */}
        <div className="hover:bg-gray-100 rounded-md p-0">
          <div className="border-t border-green-800 my-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base font-bold">{t("detail.price")}</span>
            <p className="text-base sm:text-lg text-green-800 font-bold">
              {localAnnonce.price} {t("detail.perDay")}
            </p>
          </div>
          <div className="border-t border-green-800 my-2" />
        </div>

        {/* Contact */}
        <div className="hover:bg-gray-100 rounded-md p-0 mt-2">
          <div className="border-t border-green-800 my-2" />
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 mb-1">{t("detail.contact")}</h2>
            <p className="text-md font-semibold text-blue-600">{localAnnonce.contact || "—"}</p>
          </div>
          <div className="border-t border-green-800 my-2" />
        </div>

        {/* Date */}
        {valid && (
          <div className="mt-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
              {formattedTime} {t("detail.timeSep")} {formattedDate}
            </span>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 p-4 font-bold bg-gray-100 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600">{t("detail.disclaimer")}</p>
        </div>
      </div>

      {/* Styles carrousel pour éviter le “fond blanc” qui masque après hydration */}
      <style jsx global>{`
        .carousel .slide {
          background: transparent !important;
        }
        .carousel .control-dots {
          bottom: 8px;
        }
      `}</style>
    </article>
  );
}
