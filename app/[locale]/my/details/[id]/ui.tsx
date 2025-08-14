"use client";

import { Annonce } from "../../../../../packages/mytypes/types"
//"@repo/mytypes/types";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"; 
import { useRouter } from "next/navigation";
// "../../../../../packages/ui/components/Navigation";
import EditForm from "../../../../../packages/ui/components/EditForm/EditForm";
//"@repo/ui/EditForm/EditForm";
import { LottieAnimation } from "../../../../../packages/ui/components/LottieAnimation";
//"@repo/ui/LottieAnimation";
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
  // API endpoints
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
  // API endpoints
  typeAnnoncesEndpoint: string;
  categoriesEndpoint: string;
  subCategoriesEndpoint: string;
  updateAnnonceEndpoint: string;
}) {
  const hostServerForImages = "https://picsum.photos";
  const getImageUrl = (imagePath: string) =>
    `${hostServerForImages}/${imagePath}`; 
  //const params = useParams();
  // console.log("params : ", params)
  const router = useRouter();
  //const t = useI18n(); 
  const [annonces, setAnnonce] = useState<Annonce | null>(null); // State to hold the fetched annonce
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State to manage error messages
  const [isEditModalOpen, setEditModalOpen] = useState(false); // État pour gérer la visibilité de la pop-up
  const [initialData, setInitialData] = useState({
    typeAnnonceId: annonces?.typeAnnonce?.id ?? "",
    categorieId: annonces?.categorie?.id ?? "",
    subcategorieId: String(annonces?.subcategorie?.id) ?? "",
    description: annonces?.description ?? "",
    price: annonces?.price ?? 0,
  }); // État pour les données initiales
 

  const fetchAnnonce = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/${retiveUrldetailsAnnonce}`);
      setAnnonce(response.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la récupération de l'annonce.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnnonce(); // Call the fetch function
  }, [ ]);

  const handleDelte = async () => {
    const loadingToast = toast.loading(i18nNotificationsCreating);
    try {
      const res = await axios.delete(`/fr/api/my/annonces/${annonceId}`);
      if (res.status === 200) {
        toast.success(i18nNotificationsSuccessDelete, {
          id: loadingToast,
        });
        router.push("/my/list");
        router.refresh();
      }
    } catch (error) {
      toast.error(i18nNotificationsErrorDelete, {
        id: loadingToast,
      });
      console.error("Erreur:", error);
    }
  };

  const handleUpdate = () => {
    fetchAnnonce(); // Recharge l'annonce après modification
  };

  const handleEdit = () => {
    // Remplir initialData avec les données de l'annonce actuelle
    if (annonces) {
      setInitialData({
        typeAnnonceId: annonces?.typeAnnonce?.id ?? "",
        categorieId: annonces?.categorie?.id ?? "",
        subcategorieId: String(annonces?.subcategorie?.id) ?? "",
        description: annonces?.description,
        price: annonces.price,
      });
    }
    setEditModalOpen(true);
  };

  return (
    <>
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
          handleEdit={handleEdit}
          setEditModalOpen={setEditModalOpen}
        />
      )}

      {isEditModalOpen && (
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
      )}
    </>
  );
}
