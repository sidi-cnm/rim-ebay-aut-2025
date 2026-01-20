// "use client";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Annonce } from "../../../../../packages/mytypes/types";
import { useI18n } from "../../../../../locales/client";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";
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

const fallbackImageUrl = "/noimage.jpg";

interface MyAnnonceDetailsViewProps {
  lang: string;
  annonce: Annonce | null;
  i18nAnnonce: string;
  i18nContact: string;
  i18nPrix: string;
  getImageUrl: (imagePath: string) => string;
  handleDelte: () => void;
  handleEdit: () => void;
  setEditModalOpen: (isOpen: boolean) => void;
  isDeleting?: boolean;
  deletingText?: string;
}

const MyAnnonceDetailsView: React.FC<MyAnnonceDetailsViewProps> = ({
  lang,
  annonce,
  i18nAnnonce,
  i18nContact,
  i18nPrix,
  getImageUrl,
  handleDelte,
  handleEdit,
  isDeleting = false,
  deletingText = "...",
}) => {
  const d = annonce?.createdAt ? new Date(annonce.createdAt as any) : new Date();
  const t = useI18n();
  const isAr = lang === "ar";
  // État pour afficher le message de succès après copie du lien
  const [linkCopied, setLinkCopied] = useState(false);
  const [notPublished, setNotPublished] = useState(false);
  const isPublished = annonce?.isPublished;
  const url = process.env.NODE_ENV === "production" ? "https://www.eddeyar.com" : "http://localhost:3000";
  // Fonction pour copier le lien et afficher le message de succès
  const handleCopyLink = async () => {
    try {
      // retourne le lien de l'annonce en format public
      if (isPublished){
        const domainName = process.env.NODE_ENV === "production" ? "https://www.eddeyar.com" : "http://localhost:3000";
        await navigator.clipboard.writeText(domainName + "/" + lang + "/p/annonces/details/" + annonce?.id);
        setLinkCopied(true);
        // Masquer le message après 2 secondes
        setTimeout(() => setLinkCopied(false), 2000);
      } else {
        setNotPublished(true);
        // Masquer le message après 2 secondes
        setTimeout(() => setNotPublished(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };
  

  const ImageBox: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
    <div className="relative w-full h-64 sm:h-80 lg:h-[500px] overflow-hidden rounded-xl bg-gray-50">
      <Image src={src} alt={alt} fill unoptimized className="object-cover" priority={false} />
    </div>
  );

  return (
    <article className="max-w-4xl mx-auto px-4 pb-24 sm:pb-12 pt-4">
      
      {/* 1) Carrousel */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6" dir="ltr">
        {annonce?.haveImage && Array.isArray(annonce.images) && annonce.images.length > 0 ? (
          <Carousel
            className="rounded-t-3xl overflow-hidden detail-carousel"
            infiniteLoop
            autoPlay
            showThumbs={false}
            showStatus={false}
            interval={5000}
            key={`my-carousel-${lang}-${annonce.images.length}`}
          >
            {annonce.images.map((item, idx) => (
              <div className="w-full" key={item.id ?? idx}>
                <div className="relative w-full h-64 sm:h-80 lg:h-[500px] overflow-hidden bg-gray-50">
                    <img
                        src={getImageUrl(item.imagePath)}
                        alt={annonce?.title || "image"}
                        className="w-full h-full object-contain"
                        loading="lazy"
                    />
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
             <div className="relative w-full h-64 sm:h-80 lg:h-[500px] bg-gray-50 flex items-center justify-center text-gray-400">
                <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>No Image</span>
                </div>
             </div>
        )}
      </div>

      {/* 2) Contenu principal */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
         <div className="flex-1 w-full space-y-6">
            
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                 <div className="flex flex-wrap items-start justify-between gap-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                        {annonce?.title ?? "Sans titre"}
                    </h1>
                     {annonce?.price && (
                        <div className="bg-primary-50 px-4 py-2 rounded-2xl flex items-baseline gap-1 shrink-0">
                             <span className="text-2xl font-extrabold text-primary-700">{annonce.price.toLocaleString()}</span>
                             <span className="text-sm font-bold text-primary-500">UM</span>
                        </div>
                     )}
                </div>
                 <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                     <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                         <span>📅</span>
                         <span>{d.toLocaleDateString(isAr ? "ar-MR" : "fr-FR")}</span>
                     </div>
                 </div>
            </div>

            {/* Détails */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
                 {/* Metadata Grid */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Localisation</p>
                         <p className="font-bold text-gray-900">
                             {isAr ? `${annonce?.lieuStrAr ?? ""} - ${annonce?.moughataaStrAr ?? ""}` : `${annonce?.lieuStr ?? ""} - ${annonce?.moughataaStr ?? ""}`}
                         </p>
                     </div>
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Type</p>
                         <p className="font-bold text-gray-900">
                            {isAr ? `${annonce?.typeAnnonceNameAr ?? ""} / ${annonce?.categorieNameAr ?? ""}` : `${annonce?.typeAnnonceName ?? ""} / ${annonce?.categorieName ?? ""}`}
                         </p>
                     </div>
                 </div>

                 <hr className="border-gray-100"/>
                 
                 <div className="prose prose-blue max-w-none">
                     <h3 className="text-lg font-bold text-gray-900 mb-2">{t("detail.description")}</h3>
                     <p className="text-gray-600 leading-relaxed whitespace-pre-line">{annonce?.description}</p>
                 </div>

                 {annonce?.privateDescription && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2 text-amber-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            <h4 className="font-bold text-sm uppercase tracking-wide">{t("addAnnonce.privateDescription")}</h4>
                        </div>
                        <p className="text-gray-700 text-sm">{annonce.privateDescription}</p>
                    </div>
                 )}
            </div>

             {/* Actions Bar */}
             <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200/50">
                  <button
                    onClick={handleEdit}
                    className="p-4 flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
                  >
                    <span>✏️</span>
                    <span>{lang === "ar" ? "تعديل" : "Modifier"}</span>
                  </button>
                  
                  <button
                    onClick={handleDelte}
                    disabled={isDeleting}
                    className="p-4 flex-1 bg-white border-2 border-red-100 text-red-600 font-bold h-12 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                     {isDeleting ? <span className="loader scale-75 border-red-500 border-t-transparent"></span> : (
                        <>
                            <span>🗑️</span>
                            <span>{t("detail.delete")}</span>
                        </>
                     )}
                  </button>
                  {isPublished && (
                  <div  className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                      <button onClick={handleCopyLink} className="flex items-center justify-center gap-3 w-full py-3.5 bg-white border-2 border-primary-100 text-primary-700 font-bold rounded-xl transition-colors hover:bg-primary-50">
                        <FaCopy />
                        <span dir="ltr">{isAr ? "نسخ الرابط" : "Copier le lien"}</span>
                      </button>
                        {/* Message de succès de copie */}
                        {linkCopied && (
                          <span className="text-green-600 text-sm font-medium animate-pulse">{isAr ? "تم نسخ الرابط" : "Lien copié"}</span>
                        )}
                        {notPublished && (
                          <span className="text-red-600 text-sm font-medium animate-pulse">{isAr ? "الإعلان غير منشور" : "L'annonce n'est pas publiée"}</span>
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
                  )}
             </div>
         </div>
      </div>

      <style jsx global>{`
        .carousel .slide { background: transparent !important; }
        .carousel .control-dots { bottom: 8px; }
      `}</style>

       <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid currentColor;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </article>
  );
};

export default MyAnnonceDetailsView;
