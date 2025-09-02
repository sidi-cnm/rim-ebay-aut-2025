// packages/ui/components/FormSearch/FormSearchdDynamicOptions.tsx
"use client";
import React, { useState, useEffect } from "react";
import FormSearchView from "./FormSearchView";

interface Filters {
  typeAnnonceId?: string;
  categorieId?: string;
  subCategorieId?: string;
  price?: string;
  description?: string;
  wilayaId?: string;
  moughataaId?: string;
}

interface FormSearchProps {
  lang?: string;
  onSubmit: (filters: Filters) => void;
  typeAnnoncesEndpoint: string;
  categoriesEndpoint: string;
  subCategoriesEndpoint: string;

  // 👇 nouveaux
  lieuxEndpoint: string;
  wilayaLabel: string;
  selectWilayaLabel: string;
  moughataaLabel: string;
  selectMoughataaLabel: string;

  // i18n
  annonceTypeLabel: string;
  selectTypeLabel: string;
  selectCategoryLabel: string;
  selectSubCategoryLabel: string;
  formTitle: string;
  priceLabel: string;
  searchButtonLabel: string;

  loading?: boolean;
  categoryLabel: string;
  subCategoryLabel: string;
  isSamsar?: boolean;
}

export default function FormSearch({
  lang = "ar",
  onSubmit,
  typeAnnoncesEndpoint,
  categoriesEndpoint,
  subCategoriesEndpoint,
  lieuxEndpoint,
  wilayaLabel,
  selectWilayaLabel,
  moughataaLabel,
  selectMoughataaLabel,
  annonceTypeLabel,
  selectTypeLabel,
  selectCategoryLabel,
  selectSubCategoryLabel,
  formTitle,
  priceLabel,
  searchButtonLabel,
  loading = false,
  categoryLabel,
  subCategoryLabel,
  isSamsar
}: FormSearchProps) {
  const [typeAnnonces, setTypeAnnonces] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>("");
  const [price, setPrice] = useState<number>();

  // 👇 nouveaux états
  const [wilayas, setWilayas] = useState<any[]>([]);
  const [moughataas, setMoughataas] = useState<any[]>([]);
  const [selectedWilayaId, setSelectedWilayaId] = useState<string>("");
  const [selectedMoughataaId, setSelectedMoughataaId] = useState<string>("");

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
          setSelectedCategoryId("");
          setSelectedSubCategoryId("");
        })
        .catch((err) => console.error("Error fetching categories:", err));
    } else {
      setCategories([]);
      setSubCategories([]);
      setSelectedCategoryId("");
      setSelectedSubCategoryId("");
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
      setSelectedSubCategoryId("");
    }
  }, [selectedCategoryId, subCategoriesEndpoint]);

  // 👇 wilayas
  useEffect(() => {
    fetch(`${lieuxEndpoint}?tag=wilaya`)
      .then((res) => res.json())
      .then((data) => setWilayas(Array.isArray(data?.data) ? data.data : data))
      .catch((err) => console.error("Error fetching wilayas:", err));
  }, [lieuxEndpoint]);

  // 👇 moughataas quand wilaya sélectionnée
  useEffect(() => {
    if (!selectedWilayaId) {
      setMoughataas([]);
      setSelectedMoughataaId("");
      return;
    }
    fetch(`${lieuxEndpoint}?parentId=${encodeURIComponent(selectedWilayaId)}&tag=moughataa`)
      .then((res) => res.json())
      .then((data) => {
        setMoughataas(Array.isArray(data?.data) ? data.data : data);
        setSelectedMoughataaId("");
      })
      .catch((err) => {
        console.error("Error fetching moughataas:", err);
        setMoughataas([]);
        setSelectedMoughataaId("");
      });
  }, [selectedWilayaId, lieuxEndpoint]);

  const handleTypeChange = (val: string) => {
    setSelectedTypeId(val);
  };
  const handleCategoryChange = (val: string) => {
    setSelectedCategoryId(val);
  };
  const handlePriceChange = (v: string) => {
    setPrice(v ? Number(v) : undefined);
  };

  const handleSearch = () => {
    const filters: Filters = {};
    if (selectedTypeId)        filters.typeAnnonceId = selectedTypeId;
    if (selectedCategoryId)    filters.categorieId = selectedCategoryId;
    if (selectedSubCategoryId) filters.subCategorieId = selectedSubCategoryId;
    if (price !== undefined)   filters.price = String(price);

    // 👇 nouveaux
    if (selectedWilayaId)      filters.wilayaId = selectedWilayaId;         // en DB: lieuId
    if (selectedMoughataaId)   filters.moughataaId = selectedMoughataaId;   // en DB: moughataaId

    return onSubmit(filters);
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

      // 👇 nouveaux jeux de données / sélections
      wilayas={wilayas}
      moughataas={moughataas}
      selectedWilayaId={selectedWilayaId}
      selectedMoughataaId={selectedMoughataaId}
      onWilayaChange={setSelectedWilayaId}
      onMoughataaChange={setSelectedMoughataaId}

      onTypeChange={handleTypeChange}
      onCategoryChange={handleCategoryChange}
      onSubCategoryChange={setSelectedSubCategoryId}
      onPriceChange={handlePriceChange}
      onSearch={handleSearch}

      // labels existants
      annonceTypeLabel={annonceTypeLabel}
      selectTypeLabel={selectTypeLabel}
      categoryLabel={selectCategoryLabel}
      selectCategoryLabel={selectCategoryLabel}
      subCategoryLabel={selectSubCategoryLabel}
      selectSubCategoryLabel={selectSubCategoryLabel}
      formTitle={formTitle}
      priceLabel={priceLabel}
      searchButtonLabel={searchButtonLabel}

      // 👇 labels nouveaux
      wilayaLabel={wilayaLabel}
      selectWilayaLabel={selectWilayaLabel}
      moughataaLabel={moughataaLabel}
      selectMoughataaLabel={selectMoughataaLabel}

      loading={loading}
      isSamsar={isSamsar}
    />
  );
}
