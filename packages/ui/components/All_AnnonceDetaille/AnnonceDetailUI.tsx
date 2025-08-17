"use client";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Annonce } from "../../../mytypes/types";
import { useI18n } from "../../../../locales/client";   // ⬅️ ton hook client i18n

const FALLBACK_IMG = "/noimage.jpg";

export default function AnnonceDetailUI({
  annonceId,
  annonce,
  imageServiceUrl = "https://picsum.photos",
  lang = "fr",
}: {
  annonceId: string;
  annonce: Annonce;
  imageServiceUrl?: string;
  lang?: string;                    // ⬅️ reçu de la page
}) {
  const t = useI18n();
  const isRTL = (lang || "").startsWith("ar");

  const getImageUrl = (imagePath: string) =>
    `${imageServiceUrl.replace(/\/$/, "")}/${String(imagePath || "").replace(/^\//, "")}`;

  // Date safe + locale
  const raw = annonce?.createdAt;
  const d = raw ? new Date(raw as any) : null;
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

      {/* IMAGE TOP */}
      <div className="w-full">
        {annonce?.haveImage && Array.isArray(annonce.images) && annonce.images.length > 0 ? (
          <Carousel
            className="rounded-xl"
            infiniteLoop
            autoPlay
            showThumbs={false}
            showStatus={false}
            swipeable
            emulateTouch
          >
            {annonce.images.map((item, index) => (
              <div key={item.id ?? index} className="w-full h-64 sm:h-80 md:h-96">
                <img
                  src={getImageUrl(item.imagePath)}
                  alt={annonce.title ?? `image-${index}`}
                  className="w-full h-full object-cover rounded-t-xl"
                  loading="lazy"
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-100">
            <img
              src={FALLBACK_IMG}
              alt={t("detail.noImageAlt")}
              className="w-full h-full object-cover rounded-t-xl"
            />
          </div>
        )}
      </div>

      {/* CONTENU */}
      <div className="p-2">
        <h1 className="text-xl sm:text-2xl font-bold my-2">{annonce.title}</h1>

        <p className="text-gray-600 text-sm sm:text-base mb-4">{annonce.description}</p>

        {/* Prix */}
        <div className="hover:bg-gray-100 rounded-md p-0">
          <div className="border-t border-green-800 my-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base font-bold">{t("detail.price")}</span>
            <p className="text-base sm:text-lg text-green-800 font-bold">
              {annonce.price} {t("detail.perDay")}
            </p>
          </div>
          <div className="border-t border-green-800 my-2" />
        </div>

        {/* Contact */}
        <div className="hover:bg-gray-100 rounded-md p-0 mt-2">
          <div className="border-t border-green-800 my-2" />
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 mb-1">{t("detail.contact")}</h2>
            <p className="text-md font-semibold text-blue-600">{annonce.contact || "—"}</p>
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
    </article>
  );
}
