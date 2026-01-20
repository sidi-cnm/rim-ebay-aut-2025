"use client";

import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import { Annonce } from "../../../../../../packages/mytypes/types";
import { FaMapMarkerAlt, FaTag, FaPhoneAlt, FaWhatsapp, FaShareAlt, FaCalendarAlt, FaShieldAlt, FaInfoCircle, FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { useI18n } from "../../../../../../locales/client";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon
} from "next-share";

const FALLBACK_IMG = "/noimage.jpg";
const HOST_IMAGES = "https://picsum.photos";

// Réponse minimale de /api/images/:id
type ImgDoc = { imagePath: string };

// Images toujours sous forme de tableau (jamais undefined)
type ImageItem = { id: string; imagePath: string };
type ImagesArray = NonNullable<Annonce["images"]>;

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
  annonceId: string;
  annonce: Annonce;
  lang?: string;
}) {
  const isAr = lang.startsWith("ar");
  const dir = isAr ? "rtl" : "ltr";
  const t = useI18n();

  // Copie locale de l’annonce pour merger les images chargées côté client
  const [localAnnonce, setLocalAnnonce] = useState<Annonce>(annonce);
  
  // État pour afficher le message de succès après copie du lien
  const [linkCopied, setLinkCopied] = useState(false);
  const domainName = process.env.NODE_ENV === "production" ? "https://www.eddeyar.com" : "http://localhost:3000";
  const url = domainName + "/" + lang + "/p/annonces/details/" + annonce?.id;
  // Fonction pour copier le lien et afficher le message de succès
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      // Masquer le message après 2 secondes
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

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
  }, [annonceId, lang]);

  // Helper: retourne l'URL telle quelle
  const getImageUrl = (imagePath: string) => String(imagePath || "");

  const NoImage = () => (
    <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-100 flex items-center justify-center text-gray-400">
       <span className="flex flex-col items-center gap-2">
         <FaInfoCircle className="w-8 h-8 opacity-50"/>
         No Image
       </span>
    </div>
  );

  // ✅ parse sécurisé
  const createdAt = parseDateSafe(localAnnonce?.createdAt);
  const formattedDate = createdAt
    ? createdAt.toLocaleDateString(isAr ? "ar-MR" : "fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })
    : "";

  const location = isAr
      ? `${localAnnonce.lieuStrAr || ""} - ${localAnnonce.moughataaStrAr || ""}`
      : `${localAnnonce.lieuStr || ""} - ${localAnnonce.moughataaStr || ""}`;

  const classification = isAr
      ? `${localAnnonce.classificationAr || ""}`
      : `${localAnnonce.classificationFr || ""}`;

  const category = isAr 
    ? `${localAnnonce.typeAnnonceNameAr || ""} / ${localAnnonce.categorieNameAr || ""}`
    : `${localAnnonce.typeAnnonceName || ""} / ${localAnnonce.categorieName || ""}`;

  
  return (
    <article dir={dir} className="max-w-4xl mx-auto px-4 pb-24 sm:pb-12 pt-4">
      
      {/* --- Image Gallery Section --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6" dir="ltr">
        {localAnnonce?.haveImage && Array.isArray(localAnnonce.images) && localAnnonce.images.length > 0 ? (
          <Carousel 
            showThumbs={false} 
            showStatus={false}
            infiniteLoop 
            autoPlay 
            interval={5000}
            key={`carousel-${lang}-${localAnnonce.images.length}`} 
            className="rounded-t-3xl overflow-hidden detail-carousel"
          >
            {localAnnonce.images.map((item, idx) => (
              <div key={item.id ?? idx} className="w-full">
                <div className="relative w-full h-64 sm:h-80 lg:h-[500px] overflow-hidden bg-gray-50">
                    <img
                        src={getImageUrl(item.imagePath)}
                        alt={localAnnonce.title ?? `image-${idx}`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                    />
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <NoImage />
        )}
      </div>

      {/* --- Content Section --- */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Main Info */}
        <div className="flex-1 w-full space-y-6">
            
            {/* Header: Title, Price, Date */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                        {localAnnonce.title}
                    </h1>
                     {localAnnonce.price && !localAnnonce.isPriceHidden && (
                        <div className="bg-primary-50 px-4 py-2 rounded-2xl flex items-baseline gap-1 shrink-0">
                             <span className="text-2xl font-extrabold text-primary-700">{localAnnonce.price.toLocaleString()}</span>
                             <span className="text-sm font-bold text-primary-500">UM</span>
                        </div>
                     )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-500">
                     {formattedDate && (
                         <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                             <FaCalendarAlt className="text-gray-400"/>
                             <span>{formattedDate}</span>
                         </div>
                     )}
                     <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg text-gray-700">
                          <FaTag className="text-gray-400"/>
                          <span>{classification}</span>
                     </div>
                </div>
            </div>

            {/* Details: Location, Type, Description */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
                
                {/* Location & Type Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
                            <FaMapMarkerAlt size={18} />
                        </div>
                        <div>
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                {isAr ? "الموقع" : "Localisation"}
                             </p>
                             <p className="font-bold text-gray-900">{location}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                            <FaTag size={18} />
                         </div>
                        <div>
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                {isAr ? "الفئة" : "Catégorie"}
                             </p>
                             <p className="font-bold text-gray-900">{category}</p>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100"/>

                {/* Description */}
                <div className="prose prose-blue max-w-none">
                     <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {isAr ? "الوصف" : "Description"}
                     </h3>
                     <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                         {localAnnonce.description}
                     </p>
                </div>
            </div>

             {/* Disclaimer */}
            <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 text-amber-800 text-xs sm:text-sm leading-relaxed border border-amber-100">
                 <FaShieldAlt className="shrink-0 mt-0.5 text-amber-600" size={16}/>
                 <p>{t("detail.disclaimer")}</p>
            </div>

        </div>

        {/* Sidebar / Actions */}
        <div className="w-full lg:w-80 shrink-0 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">{t("detail.contact")}</h3>
                
                {localAnnonce.contact && (
                    <div className="flex items-center justify-center gap-3 w-full py-3.5 bg-white border-2 border-primary-100 text-primary-700 font-bold rounded-xl transition-colors">
                      <FaPhoneAlt />
                      <span dir="ltr">{localAnnonce.contact}</span>
                    </div>
                )}
            </div>
            <div  className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">{isAr ? "مشاركة الإعلان" : "Partage de l’annonce"}</h3>
                <button onClick={handleCopyLink} className="flex items-center justify-center gap-3 w-full py-3.5 bg-white border-2 border-primary-100 text-primary-700 font-bold rounded-xl transition-colors hover:bg-primary-50">
                  <FaCopy />
                  <span dir="ltr">{isAr ? "نسخ الرابط" : "Copier le lien"}</span>
                </button>
                {/* Message de succès de copie */}
                {linkCopied && (
                  <span className="text-green-600 text-sm font-medium animate-pulse">{isAr ? "تم نسخ الرابط" : "Lien copié"}</span>
                )}
                    <div className="flex gap-4 items-center justify-around" >
                      <FacebookShareButton url={url}>
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>

                      <TwitterShareButton url={url}>
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>

                      <WhatsappShareButton url={url}>
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>

                      <TelegramShareButton url={url}>
                        <TelegramIcon size={32} round />
                      </TelegramShareButton>
                    </div>
            </div>

            {/* Share or other actions could go here */}
        </div>

      </div>

      {/* Styles carrousel */}
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
