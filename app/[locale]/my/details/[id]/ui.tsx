// app/[locale]/my/details/[id]/myannonce.tsx
"use client";

import { Annonce } from "../../../../../packages/mytypes/types";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import EditForm from "../../../../../packages/ui/components/EditForm/EditForm";
import { LottieAnimation } from "../../../../../packages/ui/components/LottieAnimation";
import MyAnnonceDetailsView from "./MyAnnonceDetailsView";

export default function MyAnnonceDetailsCompo({
  lang = "ar",
  annonceId,
  retiveUrldetailsAnnonce,
  i18nAnnonce,
  i18nContact,
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
  i18nNotificationsCreating: string;
  i18nNotificationsSuccessDelete: string;
  i18nNotificationsErrorDelete: string;
  typeAnnoncesEndpoint: string;
  categoriesEndpoint: string;
  subCategoriesEndpoint: string;
  updateAnnonceEndpoint: string;
}) {
  const hostServerForImages = "https://picsum.photos";
  const getImageUrl = (imagePath: string) => `${hostServerForImages}/${imagePath}`;

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
  });

  const fetchAnnonce = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        retiveUrldetailsAnnonce.startsWith("/")
          ? retiveUrldetailsAnnonce
          : `/${retiveUrldetailsAnnonce}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error(`Erreur réseau (${res.status})`);
      const data = await res.json();
      setAnnonce(data);
      setInitialData({
        typeAnnonceId: data?.typeAnnonceId ?? "",
        categorieId: data?.categorieId ?? "",
        subcategorieId: data?.subcategorieId ?? "",
        description: data?.description ?? "",
        price: Number(data?.price ?? 0),
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
    setDeleting(true);                                // démarre loader
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
    setEditModalOpen(false); // Ferme la modal après la mise à jour
  };

  const handleEdit = () => {
    if (annonces) {
      setInitialData({
        typeAnnonceId: annonces.typeAnnonce?.id ?? annonces.typeAnnonceId ?? "",
        categorieId: annonces.categorie?.id ?? annonces.categorieId ?? "",
        subcategorieId: String(
          annonces.subcategorie?.id ?? annonces?.subcategorieId ?? ""
        ),
        description: annonces.description ?? "",
        price: Number(annonces.price ?? 0),
      });
    }
    setEditModalOpen(true);
  };

  

  const isRTL = lang.startsWith("ar");

  return (
    <>
      <div className={`md:flex md:items-start gap-6 ${isRTL ? "md:flex-row-reverse" : ""}`}>
        <div className="flex-1 min-w-0">
          {loading ? (
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
  <div
    className="
      fixed inset-0 z-[9999] grid place-items-center
      bg-black/60 backdrop-blur-sm p-4
      overflow-y-auto
    " >
    <div
      className="
        w-[92vw] max-w-[380px]           /* mobile: compact */
        sm:max-w-[440px]                 /* small tablets */
        md:max-w-[520px]                 /* desktop moyen */
        lg:max-w-[560px]                 /* grand écran */
      "
    >
      <EditForm
        lang={lang}
        userid={""}
        annonceId={annonceId}
        initialData={initialData}
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