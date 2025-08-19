"use client";
import React, { useState, useEffect } from "react";
import FormSearchView from "./FormSearchView";

interface Filters {
  typeAnnonceId?: string;
  categorieId?: string;
  subCategorieId?: string;
  price?: string;
  description?: string;
}

interface FormSearchProps {
  lang?: string;
  onSubmit: (filters: Filters) => void;
  typeAnnoncesEndpoint: string;
  categoriesEndpoint: string;
  subCategoriesEndpoint: string;
  // i18n
  annonceTypeLabel: string;
  selectTypeLabel: string;
  selectCategoryLabel: string;
  selectSubCategoryLabel: string;
  formTitle: string;
  priceLabel: string;
  searchButtonLabel: string;
  // piloté par le parent
  loading?: boolean;
  categoryLabel: string;           // ⬅️ AJOUTER
  subCategoryLabel: string;  
}

export default function FormSearch({
  lang = "ar",
  onSubmit,
  typeAnnoncesEndpoint,
  categoriesEndpoint,
  subCategoriesEndpoint,
  annonceTypeLabel,
  selectTypeLabel,
  selectCategoryLabel,
  selectSubCategoryLabel,
  formTitle,
  priceLabel,
  searchButtonLabel,
  loading = false,
}: FormSearchProps) {
  const [typeAnnonces, setTypeAnnonces] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>("");
  const [price, setPrice] = useState<number>();

  // types
  useEffect(() => {
    fetch(typeAnnoncesEndpoint)
      .then((res) => res.json())
      .then((data) => setTypeAnnonces(data))
      .catch((err) => console.error("Error fetching typeAnnonces:", err));
  }, [typeAnnoncesEndpoint]);

  // categories
  useEffect(() => {
    if (selectedTypeId) {
      fetch(`${categoriesEndpoint}?parentId=${selectedTypeId}`)
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
          setSubCategories([]);
        })
        .catch((err) => console.error("Error fetching categories:", err));
    } else {
      setCategories([]);
      setSubCategories([]);
    }
  }, [selectedTypeId, categoriesEndpoint]);

  // subcategories
  useEffect(() => {
    if (selectedCategoryId) {
      fetch(`${subCategoriesEndpoint}?parentId=${selectedCategoryId}`)
        .then((res) => res.json())
        .then((data) => setSubCategories(data))
        .catch((err) => console.error("Error fetching subcategories:", err));
    } else {
      setSubCategories([]);
    }
  }, [selectedCategoryId, subCategoriesEndpoint]);

  const handleTypeChange = (val: string) => {
    setSelectedTypeId(val);
    setSelectedCategoryId("");
    setSelectedSubCategoryId("");
    setSubCategories([]);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategoryId(val);
    setSelectedSubCategoryId("");
  };

  const handlePriceChange = (v: string) => {
    setPrice(v ? Number(v) : undefined);
  };

  // ⚠️ le parent gère loading + navigation
  const handleSearch = () => {
    const filters: Filters = {};
    if (selectedTypeId) filters.typeAnnonceId = selectedTypeId;
    if (selectedCategoryId) filters.categorieId = selectedCategoryId;
    if (selectedSubCategoryId) filters.subCategorieId = selectedSubCategoryId;
    if (price !== undefined) filters.price = String(price);
    return onSubmit(filters); // (peut être async côté parent)
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
      price={price !== undefined ? String(price) : ""}
      onTypeChange={handleTypeChange}
      onCategoryChange={handleCategoryChange}
      onSubCategoryChange={setSelectedSubCategoryId}
      onPriceChange={handlePriceChange}
      onSearch={handleSearch}
      annonceTypeLabel={annonceTypeLabel}
      selectTypeLabel={selectTypeLabel}
      categoryLabel={selectCategoryLabel}
      selectCategoryLabel={selectCategoryLabel}
      subCategoryLabel={selectSubCategoryLabel}
      selectSubCategoryLabel={selectSubCategoryLabel}
      formTitle={formTitle}
      priceLabel={priceLabel}
      searchButtonLabel={searchButtonLabel}
      loading={loading} // ✅ prop reçue du parent
    />
  );
}
