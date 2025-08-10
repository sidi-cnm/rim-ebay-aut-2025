"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
//import { Category, SubCategory } from "@repo/mytypes/types";
import { Category, SubCategory } from "../../../mytypes/types";
 
import EditFormDisplay from "./EditFormDisplay";

export interface EditFormProps {
  lang: string;
  annonceId: string;
  userid: string;
  initialData: {
    typeAnnonceId: string;
    categorieId: string;
    subcategorieId: string;
    description: string;
    price: number;
  };
  onClose: () => void;
  onUpdate: () => void;
  errorsFetchTypeAnnonces?: string;
  errorsFetchCategories?: string;
  errorsFetchSubCategories?: string;
  notificationsUpdating?: string;
  notificationsSuccess?: string;
  notificationsError?: string;
  // Translated strings
  labelTypeAnnonce?: string;
  labelCategory?: string;
  labelSubCategory?: string;
  labelDescription?: string;
  labelPrice?: string;
  labelUpdate?: string;
  labelCancel?: string;
  baseApiOptions: string;
}

const EditForm: React.FC<EditFormProps> = ({
  lang,
  userid,
  annonceId,
  initialData,
  onUpdate,
  onClose,
  errorsFetchTypeAnnonces = "Failed to fetch type annonces",
  errorsFetchCategories = "Failed to fetch categories",
  errorsFetchSubCategories = "Failed to fetch subcategories",
  notificationsUpdating = "Updating...",
  notificationsSuccess = "Update successful!",
  notificationsError = "Update failed!",
  // Default translated strings
  labelTypeAnnonce = "Type Annonce",
  labelCategory = "Category",
  labelSubCategory = "Sub Category",
  labelDescription = "Description",
  labelPrice = "Price",
  labelUpdate = "Update",
  labelCancel = "Cancel",
  baseApiOptions = "",
}) => {
  //const t = useI18n();

  // baseApiOptions = "/fr/p/api/tursor";
  // if (modeOptionsApi === "sqlite") {
  //   baseApiOptions = "/fr1/p/api/sqlite";
  // }
  const [typeAnnonces, setTypeAnnonces] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<
    SubCategory[]
  >([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>(
    initialData.typeAnnonceId,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialData.categorieId,
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(
    initialData.subcategorieId,
  );
  const [description, setDescription] = useState(initialData.description);
  const [price, setPrice] = useState(initialData.price.toString());
  const router = useRouter();

  useEffect(() => {
    const fetchTypeAnnonces = async () => {
      try {
        const response = await axios.get(`${baseApiOptions}/options`);
        setTypeAnnonces(response.data);
      } catch (error) {
        toast.error(errorsFetchTypeAnnonces);
      }
    };

    fetchTypeAnnonces();
  }, [lang, errorsFetchTypeAnnonces]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedTypeId) {
        try {
          const response = await axios.get(
            `${baseApiOptions}/options?parentId=${selectedTypeId}`,
          );
          setCategories(response.data);
        } catch (error) {
          toast.error(errorsFetchCategories);
        }
      } else {
        setCategories([]);
      }
    };

    fetchCategories();
  }, [selectedTypeId, lang, errorsFetchCategories]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategoryId) {
        try {
          const response = await axios.get(
            `${baseApiOptions}/options?parentId=${selectedCategoryId}`,
          );
          setFilteredSubCategories(response.data);
        } catch (error) {
          toast.error(errorsFetchSubCategories);
        }
      } else {
        setFilteredSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId, lang, errorsFetchSubCategories]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loadingToast = toast.loading(notificationsUpdating);

    try {
      const annonceData = {
        typeAnnonceId: selectedTypeId,
        categorieId: selectedCategoryId,
        subcategorieId: selectedSubCategoryId,
        lieuId: 1,
        userId: userid,
        description,
        price: Number(price),
        title: "Titre",
        contact: "contact",
        haveImage: false,
        firstImagePath: "",
        images: [],
        status: "active",
      };

      const response = await axios.put(
        `/${lang}/api/annonces/${annonceId}`,
        annonceData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status !== 200) {
        throw new Error("Erreur lors de la mise à jour de l'annonce");
      }

      toast.success(notificationsSuccess, {
        id: loadingToast,
      });
      // router.push(`/my/details/${annonceId}?a=b`);
      router.refresh();
      onClose();
      onUpdate();
    } catch (error) {
      toast.error(notificationsError, {
        id: loadingToast,
      });
      console.error("Erreur:", error);
    }
  };

  return (
    <EditFormDisplay
      typeAnnonces={typeAnnonces}
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
      handleSubmit={handleSubmit}
      onClose={onClose}
      lang={lang}
      editTitle={lang === "fr" ? "Modifier l'annonce" : "Edit the ad"}
      cancelLabel={labelCancel}
      updateLabel={labelUpdate}
      annonceTypeLabel={labelTypeAnnonce}
      categoryLabel={labelCategory}
      selectCategoryLabel={labelCategory}
      subCategoryLabel={labelSubCategory}
      selectSubCategoryLabel={labelSubCategory}
      descriptionLabel={labelDescription}
      priceLabel={labelPrice}
    />
  );
};

export default EditForm;
