// "use client";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Annonce } from "../../../../../packages/mytypes/types";
import { useI18n } from "../../../../../locales/client";

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

  const ImageBox: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
    <div className="relative w-full h-64 sm:h-80 lg:h-[500px] overflow-hidden rounded-xl bg-gray-50">
      <Image src={src} alt={alt} fill unoptimized className="object-cover" priority={false} />
    </div>
  );

  return (
    <article className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-4 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] mx-auto my-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-600 text-center">{i18nAnnonce}</h2>

      {/* 👇 Forcer LTR pour éviter le bug du carrousel en RTL */}
      <div className="w-full overflow-hidden rounded-xl" dir="ltr">
        {annonce?.haveImage && Array.isArray(annonce.images) && annonce.images.length > 0 ? (
          <Carousel
            className="rounded-xl"
            infiniteLoop
            autoPlay
            showThumbs={false}
            showStatus={false}
            dynamicHeight={false}
            swipeable
            emulateTouch
            key={`my-carousel-${lang}-${annonce.images.length}`}
          >
            {annonce.images.map((item, idx) => (
              <div className="w-full" key={item.id ?? idx}>
                <ImageBox src={getImageUrl(item.imagePath)} alt={annonce?.title || "image"} />
              </div>
            ))}
          </Carousel>
        ) : (
          <ImageBox src={annonce?.firstImagePath || fallbackImageUrl} alt="no image uploaded by user" />
        )}
      </div>

      <div className="mt-2" />

      <div className="p-0">
        <div className="flex justify-between items-center">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
            {d.getDate()}-{d.getMonth() + 1}-{d.getFullYear()} | {d.getHours()}h : {d.getMinutes()}min |
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold my-2">{t("detail.description")}</h1>

        <p className="text-gray-600 text-sm sm:text-base mb-4">{annonce?.description}</p>

        {/* Prix */}
        <div className="hover:bg-gray-100 rounded-md p-0">
          <div className="border-t border-green-800 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base font-bold">{i18nPrix}</span>
            <p className="text-base sm:text-lg text-green-800 font-bold">
              {annonce?.price} {t("detail.perDay")}
            </p>
          </div>
          <div className="border-t border-green-800 my-2"></div>
        </div>

        {/* Contact */}
        <div className="hover:bg-gray-100 rounded-md p-0 mt-2">
          <div className="border-t border-green-800 my-2"></div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 mb-1">{i18nContact}</h2>
            <p className="text-md font-semibold text-blue-600">{parseInt(String(annonce?.contact || 0))}</p>
          </div>
          <div className="border-t border-green-800 my-2"></div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
          <button
            onClick={handleDelte}
            disabled={isDeleting}
            className="bg-red-500 w-full sm:w-44 h-10 hover:bg-red-600 rounded-lg text-white font-bold"
          >
            {isDeleting ? <div className="loader"></div> : <span>{t("detail.delete")}</span>}
          </button>
          <button
            data-cy="edit-button"
            onClick={handleEdit}
            className="bg-green-500 w-full sm:w-44 h-10 rounded-lg hover:bg-green-600 text-white font-bold"
          >
            {lang === "ar" ? "حرر" : "Edit"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        /* évite un fond blanc qui masque après hydration */
        .carousel .slide {
          background: transparent !important;
        }
        .carousel .control-dots {
          bottom: 8px;
        }
      `}</style>

      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin: auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </article>
  );
};

export default MyAnnonceDetailsView;
