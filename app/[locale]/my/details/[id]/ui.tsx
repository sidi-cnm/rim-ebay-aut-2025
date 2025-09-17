"use client";

import { Annonce } from "../../../../../packages/mytypes/types";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import EditForm from "../../../../../packages/ui/components/EditForm/EditForm";
import { LottieAnimation } from "../../../../../packages/ui/components/LottieAnimation";
import MyAnnonceDetailsView from "./MyAnnonceDetailsView";

type ImgDoc = { imagePath: string };
type ImageItem = { id: string; imagePath: string };
type ImagesArray = ImageItem[];

export default function MyAnnonceDetailsCompo({
  lang = "ar",
  annonceId,
  retiveUrldetailsAnnonce,
  i18nAnnonce,
  i18nContact,
  userFromDB,
  i18nPrix,
  i18nNotificationsCreating,
  i18nNotificationsSuccessDelete,
  i18nNotificationsErrorDelete,
  typeAnnoncesEndpoint,
  categoriesEndpoint,
  subCategoriesEndpoint,
  updateAnnonceEndpoint,
}: {
  lang?: string;
  annonceId: string;
  retiveUrldetailsAnnonce: string;
  i18nAnnonce: string;
  i18nContact: string;
  i18nPrix: string;
  userFromDB: boolean ;
  i18nNotificationsCreating: string;
  i18nNotificationsSuccessDelete: string;
  i18nNotificationsErrorDelete: string;
  typeAnnoncesEndpoint: string;
  categoriesEndpoint: string;
  subCategoriesEndpoint: string;
  updateAnnonceEndpoint: string;
}) {
  // retourne l’URL telle quelle (Blob public)
  const getImageUrl = (imagePath: string) => imagePath;

  const normalizeImages = (arr?: ImgDoc[]): ImagesArray => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    return arr.map((im, i) => ({ id: String(i), imagePath: String(im.imagePath || "") }));
  };

  const router = useRouter();
  const [annonces, setAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [initialData, setInitialData] = useState({
    typeAnnonceId: "",
    categorieId: "",
    subcategorieId: "",
    description: "",
    price: 0,
    moughataaId: "",
    wilayaId: "",
    rentalPeriod:"",
    rentalPeriodAr:"",
    directNegotiation:false,
    issmar:false,
  });

  const onEditImages = () => {
    router.push(`/${lang}/my/details/${annonceId}/images`);
  }

  const fetchAnnonce = async () => {
    setLoading(true);
    try {
      // 1) annonce
      const url = retiveUrldetailsAnnonce.startsWith("/")
        ? retiveUrldetailsAnnonce
        : `/${retiveUrldetailsAnnonce}`;
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Erreur réseau (${res.status})`);
      const data = await res.json();

      // 2) images de l'annonce
      const imgRes = await fetch(`/${lang}/api/images/${data?.id ?? annonceId}`, { cache: "no-store" });
      let imgs: { haveImage?: boolean; firstImagePath?: string | null; images?: ImgDoc[] } = {};
      if (imgRes.ok) imgs = await imgRes.json().catch(() => ({}));

      // 3) normalisation + fallback
      const normalized = normalizeImages(imgs.images);
      const mergedImages: ImagesArray =
        normalized.length === 0 && imgs.firstImagePath
          ? [{ id: "0", imagePath: String(imgs.firstImagePath) }]
          : normalized;

      // 4) merge final dans l’état attendu par la View
      setAnnonce({
        ...data,
        haveImage: (imgs.haveImage ?? data.haveImage ?? false) || mergedImages.length > 0,
        firstImagePath: imgs.firstImagePath ?? data.firstImagePath ?? "",
        images: mergedImages.length > 0 ? mergedImages : (data.images ?? []),
      });

      console.log("Annonce fetched::::", { ...data, images: mergedImages });

      setInitialData({
        typeAnnonceId: data?.typeAnnonceId ?? "",
        categorieId: data?.categorieId ?? "",
        subcategorieId: data?.subcategorieId ?? "",
        description: data?.description ?? "",
        price: Number(data?.price ?? 0),
        moughataaId: data?.moughataaId ?? "",
        wilayaId: data?.lieuId ?? "",
        rentalPeriod: data?.rentalPeriod ?? "",
        rentalPeriodAr: data?.rentalPeriodAr ?? "",
        directNegotiation: data?.directNegotiation ?? false,
        issmar: data?.issmar ?? false,
      });

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération de l'annonce.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonce();
  }, []);

  const handleDelte = async () => {
    const loadingToast = toast.loading(i18nNotificationsCreating);
    setDeleting(true);
    try {
      const res = await fetch(`/${lang}/api/my/annonces/${annonceId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Suppression échouée");
      toast.success(i18nNotificationsSuccessDelete, { id: loadingToast });
      router.push(`/${lang}/my/list`);
      router.refresh();
    } catch (error) {
      toast.error(i18nNotificationsErrorDelete, { id: loadingToast });
      console.error("Erreur:", error);
      setDeleting(false);
    }
  };

  const handleUpdate = () => {
    fetchAnnonce();
    setEditModalOpen(false);
  };

  const handleEdit = () => {
    if (annonces) {
      setInitialData({
        typeAnnonceId: annonces.typeAnnonce?.id ?? annonces.typeAnnonceId ?? "",
        categorieId: annonces.categorie?.id ?? annonces.categorieId ?? "",
        subcategorieId: String(annonces.subcategorie?.id ?? annonces?.subcategorieId ?? ""),
        description: annonces.description ?? "",
        wilayaId: annonces.lieuId ?? "",
        moughataaId: annonces.moughataaId ?? "",
        price: Number(annonces.price ?? 0),
        rentalPeriod: annonces.rentalPeriod ?? "",
        rentalPeriodAr: annonces.rentalPeriodAr ?? "",
        directNegotiation: annonces.directNegotiation ?? false,
        issmar: annonces.issmar ?? false,
      });
    }
    setEditModalOpen(true);
  };

  const isRTL = lang.startsWith("ar");

  return (
    <>
      <div className={`md:flex md:items-start gap-6 ${isRTL ? "md:flex-row-reverse" : ""}`}>
        <div className="flex-1 min-w-0">
          {loading && !isEditModalOpen ?  (
            <LottieAnimation />
          ) : (
            <MyAnnonceDetailsView
              lang={lang}
              annonce={annonces}
              i18nAnnonce={i18nAnnonce}
              i18nContact={i18nContact}
              i18nPrix={i18nPrix}
              getImageUrl={getImageUrl}
              handleDelte={handleDelte}
              isDeleting={deleting}
              handleEdit={handleEdit}
              setEditModalOpen={setEditModalOpen}
            />
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-[92vw] max-w-[380px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[560px]">
            <EditForm
              lang={lang}
              userFromDB={userFromDB}
              userid={""}
              annonceId={annonceId}
              initialData={initialData}
              onEditImages={onEditImages}
              onClose={() => setEditModalOpen(false)}
              onUpdate={handleUpdate}
              typeAnnoncesEndpoint={typeAnnoncesEndpoint}
              categoriesEndpoint={categoriesEndpoint}
              subCategoriesEndpoint={subCategoriesEndpoint}
              updateAnnonceEndpoint={updateAnnonceEndpoint}
            />
          </div>
        </div>
      )}
    </>
  );
}
