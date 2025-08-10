"use client";
import React, { useState, useEffect } from "react";
// import { useI18n } from "../../../apps/rim-ebay/locales/client";
 

interface Filters {
  typeAnnonceId?: string;
  categorieId?: string;
  subCategorieId?: string;
  price?: string;
  description?: string;
}

import FormSearchView from "./FormSearchView";

interface FormSearchProps {
  lang?: string;
  onSubmit: (filters: Filters) => void;
  typeAnnonceLabel?: string;
  categoryLabel?: string;
  subCategoryLabel?: string;
  priceLabel?: string;
  searchButtonLabel?: string;
  modeOptionsApi: "sqlite" | "tursor";
}

export default function FormSearch({
  lang = "ar",
  onSubmit,
  modeOptionsApi = "sqlite", // ✅ Ajout de la prop pour le mode API
}: FormSearchProps) {
  let baseApiOptions = "/fr/p/api/tursor/";
  if (modeOptionsApi === "sqlite") {
    baseApiOptions = "/fr/p/api/sqlite/";
  }
  const [typeAnnonces, setTypeAnnonces] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // ✅ Toujours un tableau
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    useState<string>("");
  const [price, setPrice] = useState<number>();
 
  // 🔹 Charger les types d'annonces au chargement
  useEffect(() => {
    fetch(`${baseApiOptions}/options`)
      .then((res) => res.json())
      .then((data) => setTypeAnnonces(data))
      .catch((error) => console.error("Error fetching typeAnnonces:", error));
  }, [lang]);

  useEffect(() => {
    if (selectedTypeId !== undefined) {
      console.log(`Fetching categories for typeAnnonceId: ${selectedTypeId}`);
      fetch(`${baseApiOptions}/options?parentId=${selectedTypeId}`)
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
          setSubCategories([]);
        })
        .catch((error) => console.error("Error fetching categories:", error));
    } else {
      setCategories([]);
      setSubCategories([]);
    }
  }, [selectedTypeId, lang]);

  useEffect(() => {
    if (selectedCategoryId !== undefined) {
      console.log(
        `Fetching subcategories for categoryId: ${selectedCategoryId}`,
      );
      fetch(`${baseApiOptions}/options?parentId=${selectedCategoryId}`)
        .then((res) => res.json())
        .then((data) => setSubCategories(data))
        .catch((error) =>
          console.error("Error fetching subcategories:", error),
        );
    } else {
      setSubCategories([]);
    }
  }, [selectedCategoryId, lang]);

  const handleTypeChange = (value: string) => {
    console.log("Nouvelle valeur sélectionnée pour Type d'annonce:", value);
    setSelectedTypeId(value);
    setSelectedCategoryId(""); // Réinitialisation de la catégorie
    setSubCategories([]); // Réinitialisation des sous-catégories
  };

  const handleCategoryChange = (value: string) => {
    console.log("Changement de catégorie:", value); // DEBUG
    setSelectedCategoryId(value);
  };

  const handlePriceChange = (value: string) => {
    const newValue = value ? Number(value) : undefined;
    console.log("Changement de prix:", newValue);
    setPrice(newValue);
  };

  const handleSearch = () => {
    const filters: Filters = {};
    console.log("Recherche avec les filtres suivants:", {
      selectedTypeId,
      selectedCategoryId,
      selectedSubCategoryId,
      price
    }); // DEBUG

    if (selectedTypeId) filters.typeAnnonceId = selectedTypeId.toString();
    if (selectedCategoryId) filters.categorieId = selectedCategoryId.toString();
    if (selectedSubCategoryId)
      filters.subCategorieId = selectedSubCategoryId.toString();
    if (price !== undefined) filters.price = price.toString(); // ✅ Conversion en string

    onSubmit(filters);
  };

  return (
    <FormSearchView
      lang={lang}
      typeAnnonces={typeAnnonces}
      categories={categories}
      subCategories={subCategories}
      selectedTypeId={selectedTypeId}
      selectedCategoryId={selectedCategoryId}
      selectedSubCategoryId={selectedSubCategoryId}
      price={price !== undefined ? price.toString() : ""}
      onSearch={handleSearch}
      onTypeChange={handleTypeChange}
      onCategoryChange={handleCategoryChange}
      onSubCategoryChange={setSelectedSubCategoryId}
      onPriceChange={handlePriceChange}
      annonceTypeLabel="filter.type"
      selectTypeLabel="filter.type"
      categoryLabel="filter.category"
      selectCategoryLabel="filter.category"
      subCategoryLabel="filter.subcategory"
      selectSubCategoryLabel="filter.subcategory"
      formTitle="filter.title"
      priceLabel="filter.price"
      searchButtonLabel="filter.search"
    />
  );
}