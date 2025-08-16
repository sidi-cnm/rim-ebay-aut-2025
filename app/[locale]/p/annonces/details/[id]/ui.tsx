"use client";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import { Annonce } from "../../../../../../packages/mytypes/types";

const FALLBACK_IMG = "/noimage.jpg";
const HOST_IMAGES = "https://picsum.photos";

// Utilitaire: construit une URL d'image propre
function buildImageUrl(path: string) {
  const base = HOST_IMAGES.replace(/\/$/, "");
  const p = String(path || "").replace(/^\//, "");
  return `${base}/${p}`;
}

// Utilitaire: parse une date de manière sûre
function parseDateSafe(input: unknown): Date | null {
  if (input == null) return null; // null/undefined
  // évite de passer "" au Date()
  if (typeof input === "string" && input.trim() === "") return null;
  const d = new Date(input as string | number | Date);
  return isNaN(d.getTime()) ? null : d;
}

export default function AnnonceDetailUI({
  annonceId,
  annonce,
  lang = "fr", // facultatif si tu veux formatter en fr/ar
}: {
  annonceId: string;   // ✅ en général tes ids sont des strings
  annonce: Annonce;
  lang?: string;
}) {
  const imgFromPath = (imagePath: string, alt = "") => {
    const src = imagePath ? buildImageUrl(imagePath) : FALLBACK_IMG;
    return (
      <div className="relative h-40 sm:h-60 w-full">
        <Image
          src={src}
          alt={alt || "image"}
          fill
          unoptimized
          style={{ objectFit: "cover" }}
          className="rounded-lg"
        />
      </div>
    );
  };

  const NoImage = () => (
    <div className="relative h-40 sm:h-60 w-full">
      <Image
        src={FALLBACK_IMG}
        alt="no image uploaded by user"
        fill
        unoptimized
        style={{ objectFit: "cover" }}
        className="rounded-lg"
      />
    </div>
  );

  // ✅ parse sécurisé
  const createdAt = parseDateSafe(annonce?.createdAt);

  // ✅ formatage uniquement si la date est valide
  const formattedDate = createdAt
    ? createdAt.toLocaleDateString(lang.startsWith("ar") ? "ar-MR" : "fr-FR")
    : "";

  const formattedTime = createdAt
    ? createdAt.toLocaleTimeString(lang.startsWith("ar") ? "ar-MR" : "fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <article className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-4 max-w-lg mx-auto my-6 sm:max-w-2xl sm:p-6 md:my-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">
        Détails de l’annonce
      </h2>

      <div className="space-y-2 h-40 sm:h-60 w-full">
        {annonce?.haveImage && Array.isArray(annonce.images) && annonce.images.length > 0 ? (
          <Carousel className="rounded-xl" infiniteLoop autoPlay showThumbs={false}>
            {annonce.images.map((item, idx) => (
              <div className="h-40 sm:h-60" key={item.id ?? idx}>
                {imgFromPath(item.imagePath, annonce.title ?? "image")}
              </div>
            ))}
          </Carousel>
        ) : (
          <NoImage />
        )}
      </div>

      <div className="p-2">
        <span className="inline-block bg-green-800 rounded-md px-2 py-1 text-xs sm:text-sm font-semibold text-white">
          {annonce.typeAnnonceNameAr || annonce.typeAnnonceName} /{" "}
          {annonce.categorieNameAr || annonce.categorieName}
        </span>

        <h1 className="text-xl sm:text-2xl font-bold my-2">{annonce.title}</h1>

        <p className="text-gray-600 text-sm sm:text-base mb-4">
          {annonce.description}
        </p>

        <div className="hover:bg-gray-100 rounded-md p-0">
          <div className="border-t border-green-800 my-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base font-bold">PRIX</span>
            <p className="text-base sm:text-lg text-green-800 font-bold">
              {annonce.price} UMR / jour
            </p>
          </div>
          <div className="border-t border-green-800 my-2" />
        </div>

        <div className="hover:bg-gray-100 rounded-md p-0 mt-2">
          <div className="border-t border-green-800 my-2" />
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Contact</h2>
            <p className="text-md font-semibold text-blue-600">
              {annonce.contact || "—"}
            </p>
          </div>
          <div className="border-t border-green-800 my-2" />
        </div>

        {createdAt && (
          <div className="mt-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
              {formattedDate} {formattedTime ? `| ${formattedTime}` : ""}
            </span>
          </div>
        )}

        <div className="mt-6 p-4 font-bold bg-gray-100 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600">
            Notre plateforme n'est pas responsable de ce produit ou service.
            Toutes les informations sont fournies par l'annonceur, et nous ne
            garantissons pas leur exactitude ou leur qualité. Veuillez effectuer
            vos propres vérifications avant de procéder à tout achat ou
            réservation.
          </p>
        </div>
      </div>
    </article>
  );
}
