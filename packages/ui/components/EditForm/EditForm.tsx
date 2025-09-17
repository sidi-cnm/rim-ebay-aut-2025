"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";   // ⬅️ Toaster local
import { useRouter } from "next/navigation";
import { Category, SubCategory } from "../../../mytypes/types";
import EditFormDisplay from "./EditFormDisplay";
import { useI18n } from "../../../../locales/client";


type Position = "owner" | "broker" | "other";

export interface EditFormProps {
  lang: string;
  annonceId: string;
  userid: string;
  userFromDB: boolean;
  initialData: {
    typeAnnonceId: string;
    categorieId: string;
    subcategorieId: string;
    description: string;
    price: number;
    wilayaId: string;
    moughataaId: string;
    rentalPeriod: string;
    rentalPeriodAr: string;
    issmar: boolean;
    directNegotiation: boolean | null;

  };
  onClose: () => void;
  onEditImages: () => void;
  onUpdate: () => void;
  typeAnnoncesEndpoint: string;
  categoriesEndpoint: string;
  subCategoriesEndpoint: string;
  updateAnnonceEndpoint: string;
}

const EditForm: React.FC<EditFormProps> = ({
  lang,
  userid,
  annonceId,
  userFromDB,
  initialData,
  onUpdate,
  onEditImages,
  onClose,
  typeAnnoncesEndpoint,
  categoriesEndpoint,
  subCategoriesEndpoint,
  updateAnnonceEndpoint,
}) => {
  const t = useI18n();

  const [typeAnnonces, setTypeAnnonces] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>(initialData.typeAnnonceId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialData.categorieId);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(initialData.subcategorieId);
  const [description, setDescription] = useState(initialData.description);
  const [price, setPrice] = useState(initialData.price.toString());
  

  const [rentalPeriod, setRentalPeriod] = useState(initialData.rentalPeriod);
const [rentalPeriodAr, setRentalPeriodAr] = useState(initialData.rentalPeriodAr);
const [issmar, setIssmar] = useState(initialData.issmar);

const [directNegotiation, setDirectNegotiation] = useState(initialData.directNegotiation);


  // loader état
  const [submitting, setSubmitting] = useState(false);
  const [wilayas, setWilayas] = useState<any[]>([]);
  const [moughataas, setMoughataas] = useState<any[]>([]);
  const [selectedWilayaId, setSelectedWilayaId] = useState(initialData.wilayaId);
  const [selectedMoughataaId, setSelectedMoughataaId] = useState(initialData.moughataaId);


  console.log("initialData:::", initialData);


  // --- inside EditForm.tsx ---

// When type changes (owner vs broker), update issmar + directNegotiation automatically
useEffect(() => {
  const selectedType = typeAnnonces.find((t) => t.id === selectedTypeId);
  if (!selectedType) return;

  // Ici on se base sur issamsar
  if (selectedType.issmar) {
    setIssmar(true);
    // directNegotiation reste éditable
  } else {
    setIssmar(false);
    setDirectNegotiation(null); // reset si ce n'est pas un samsar
  }
}, [selectedTypeId, typeAnnonces]);




  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(typeAnnoncesEndpoint);
        setTypeAnnonces(res.data);
      } catch {
        toast.error(t("editForm.errors.fetchTypes"));
      }
    })();
  }, [typeAnnoncesEndpoint, t]);

  useEffect(() => {
    (async () => {
      if (!selectedTypeId) return setCategories([]);
      try {
        const res = await axios.get(`${categoriesEndpoint}?parentId=${selectedTypeId}`);
        setCategories(res.data);
      } catch {
        toast.error(t("editForm.errors.fetchCategories"));
      }
    })();
  }, [selectedTypeId, categoriesEndpoint, t]);

  useEffect(() => {
    (async () => {
      if (!selectedCategoryId) return setFilteredSubCategories([]);
      try {
        const res = await axios.get(`${subCategoriesEndpoint}?parentId=${selectedCategoryId}`);
        setFilteredSubCategories(res.data);
      } catch {
        toast.error(t("editForm.errors.fetchSubCategories"));
      }
    })();
  }, [selectedCategoryId, subCategoriesEndpoint, t]);


  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/${lang}/p/api/tursor/lieux?tag=wilaya`);
        setWilayas(res.data?.data || []);
      } catch {
        toast.error(t("editForm.fetchWilayaError"));
      }
    })();
  }, [lang, t]);


  useEffect(() => {
    if (!selectedWilayaId) {
      setMoughataas([]);
      setSelectedMoughataaId("");
      return;
    }
    (async () => {
      try {
        const res = await axios.get(`/${lang}/p/api/tursor/lieux?parentId=${selectedWilayaId}&tag=moughataa`);
        setMoughataas(res.data?.data || []);
      } catch {
        toast.error(t("editForm.fetchMoughataasError"));
      }
    })();
  }, [selectedWilayaId, lang, t]);
  
  
  console.log("typeAnnonces:::::", typeAnnonces);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const toastId = toast.loading(t("editForm.notifications.updating"));
    try {
      const annonceData = {
        typeAnnonceId: selectedTypeId,
        categorieId: selectedCategoryId,
        subcategorieId: selectedSubCategoryId,
        description,
        price: Number(price),
        lieuId: selectedWilayaId,
        moughataaId: selectedMoughataaId,
        rentalPeriod,
        rentalPeriodAr,
        issmar,
        directNegotiation
      };

      const res = await axios.put(updateAnnonceEndpoint, annonceData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.status !== 200) throw new Error("Update failed");

      // succès
      toast.success(t("editForm.notifications.success"), { id: toastId });
      setSubmitting(false);   // ⬅️ enlève l’overlay avant de fermer
      onClose();              // ⬅️ ferme la modale immédiatement
      onUpdate();             // ⬅️ refetch (affichera le détail mis à jour)
      router.refresh();       // ⬅️ rafraîchit la route
    } catch (err: any) {
      console.error("Error updating annonce:", err);
      const apiMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        t("editForm.notifications.error");

      toast.error(apiMsg, { id: toastId });
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Toaster local à ce composant (pas besoin du layout) */}
      <Toaster position="bottom-center"  />

      <EditFormDisplay
        typeAnnonces={typeAnnonces}
        userFromDB={userFromDB}
        categories={categories}
        filteredSubCategories={filteredSubCategories}
        selectedTypeId={selectedTypeId}
        setSelectedTypeId={setSelectedTypeId}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        selectedSubCategoryId={selectedSubCategoryId}
        setSelectedSubCategoryId={setSelectedSubCategoryId}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        rentalPeriod={rentalPeriod}
        setRentalPeriod={setRentalPeriod} 
        rentalPeriodAr={rentalPeriodAr}
        setRentalPeriodAr={setRentalPeriodAr}
        issmar={issmar}
        setIssmar={setIssmar}
        directNegotiation={directNegotiation}
        setDirectNegotiation={setDirectNegotiation}
        handleSubmit={handleSubmit}
        onClose={onClose}
        lang={lang}
        /* i18n */
        editTitle={t("editForm.title")}
        annonceTypeLabel={t("editForm.type")}
        categoryLabel={t("editForm.category")}
        selectCategoryLabel={t("editForm.selectCategory")}
        subCategoryLabel={t("editForm.subCategory")}
        selectSubCategoryLabel={t("editForm.selectSubCategory")}
        descriptionLabel={t("editForm.description")}
        priceLabel={t("editForm.price")}
        cancelLabel={t("editForm.cancel")}
        updateLabel={submitting ? t("editForm.updating") : t("editForm.update")}
        /* lieux */
        wilayas={wilayas}
        moughataas={moughataas}
        selectedWilayaId={selectedWilayaId}
        setSelectedWilayaId={setSelectedWilayaId}
        selectedMoughataaId={selectedMoughataaId}
        setSelectedMoughataaId={setSelectedMoughataaId}
        /* état submit */
        onEditImages={onEditImages}
        submitting={submitting}
      />

      {/* Overlay loader pendant l’envoi */}
      {submitting && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] grid place-items-center rounded-xl">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow">
            <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
            <span className="text-sm font-medium">
              {t("editForm.notifications.updating")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditForm;
