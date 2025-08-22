"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useI18n } from "../../../../locales/client";
import axios from "axios";
import { Category, SubCategory, TypeAnnonce } from "../../../../packages/mytypes/types"
//"@repo/mytypes/types";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";


//const baseAnnonceApi = "/fr/api/my/annonces";

export default function AddAnnonceUI({
  lang = "ar", 
  relavieUrlOptionsModel ="",
  relavieUrlAnnonce  
}: {
  lang?: string; 
  relavieUrlOptionsModel: string;
   relavieUrlAnnonce: string;
}) {
//}) {
  const router = useRouter();
  const t = useI18n();

  const [typeAnnonces, setTypeAnnonces] = useState<TypeAnnonce[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTypeId, setSelectedTypeId] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>();
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<
    SubCategory[]
  >([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const DataInsideNavigation = useSearchParams();
  const [submitting, setSubmitting] = useState(false); // ⬅️ loader état
  console.log("relavieUrlOptionsModel : ", relavieUrlOptionsModel);

  useEffect(() => {
    const fetchTypeAnnonces = async () => {
      try { 
        const res = await fetch(`${relavieUrlOptionsModel}/options`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        console.log("data", data);
        setTypeAnnonces(data);
      } catch (error) {
        toast.error(t("errors.fetchTypeAnnonces"));
      }
    };


    fetchTypeAnnonces();
  }, [lang, t]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedTypeId !== undefined) {
        try {
          const response = await axios.get( 
            `${relavieUrlOptionsModel}/options?parentId=${encodeURIComponent(selectedTypeId)}`,
          );
          setCategories(response.data);
        } catch (error) {
          console.log("error ::", error);
          toast.error(t("errors.fetchCategories"));
        }
      } else {
        setCategories([]);
      }
    };

    fetchCategories();
  }, [selectedTypeId, lang, t]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategoryId !== undefined) {
        try {
          const response = await axios.get( 
            `${relavieUrlOptionsModel}/options?parentId=${encodeURIComponent(selectedCategoryId)}`,
          );

          setFilteredSubCategories(response.data);
        } catch (error) {
          console.log("error", error);
          toast.error(t("errors.fetchSubCategories"));
        }
      } else {
        setFilteredSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId, lang, t]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = String(e.target.value);
    const selectedType = typeAnnonces.find(
      (type) => String(type.id) === String(typeId),
    );
    if (selectedType) {
      setSelectedType(selectedType.name);
      setSelectedTypeId(typeId);
      setSelectedCategory("");
      setSelectedCategoryId(undefined);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = String(e.target.value);
    const category = categories.find((cat) => String(cat.id) === categoryId);
    if (category) {
      setSelectedCategory(category.name);
      setSelectedCategoryId(categoryId);
      setSelectedSubCategory("");
      setSelectedSubCategoryId(undefined);
      // setFilteredSubCategories(undefined);
    }
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subCategoryId = String(e.target.value);
    const subCategory = filteredSubCategories.find(
      (subCat) => String(subCat.id) === subCategoryId,
    );
    if (subCategory) {
      setSelectedSubCategory(subCategory.name);
      setSelectedSubCategoryId(subCategoryId);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true)

    const loadingToast = toast.loading(t("notifications.creating"));

    try {
      // Validate required fields
      if (!selectedTypeId) {
        console.log("selectedTypeId", selectedTypeId);
      }

      if (!selectedCategoryId) {
        console.log("selectedCategoryId", selectedCategoryId);
      }

      if (!selectedSubCategoryId) {
        console.log("selectedSubCategoryId", selectedSubCategoryId);
      }

      if (!selectedTypeId || !selectedCategoryId || !selectedSubCategoryId) {
        toast.error(t("errors.requiredFields"), {
          id: loadingToast,
        });
        return;
      }

      const annonceData = {
        typeAnnonceId: selectedTypeId.toString(),
        categorieId: selectedCategoryId.toString(),
        subcategorieId: selectedSubCategoryId.toString(),
        lieuId: selectedSubCategoryId.toString(),
        //userId: userid.toString(),
        title: description.substring(0, 50), // Use first 50 chars of description as title
        description: description,
        price: Number(price),
        //contact: userid.toString(), // Use userId as contact for now
        haveImage: false,
        firstImagePath: "",
        images: [],
        status: "active",
      };

      const res = await fetch(`${relavieUrlAnnonce}`, {
        method: "POST",
        body: JSON.stringify(annonceData),
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.message || t("notifications.error"), {
          id: loadingToast,
        });
        return;
      }

      toast.success(t("notifications.success"), {
        id: loadingToast,
      });

      // Only navigate after successful creation
      router.push(`/fr/my/list`);
      router.refresh();
    } catch (error) {
      toast.error(t("notifications.error"), {
        id: loadingToast,
      });
      console.error("Erreur:", error);
    }
    finally {
      setSubmitting(false); // ⬅️ stop loader (si on reste sur la page)
    }
  };

  return (
    <main className="min-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-semibold mb-4 text-center text-gray-700">
          {t("addAnnonce.addNew")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8"
        >
          <div className="mb-6 relative">
            <label
              htmlFor="type"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              {t("addAnnonce.annonceType")}
            </label>
            <select
              id="type"
              value={selectedTypeId}
              onChange={handleTypeChange}
              className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
            >
              <option value="">{t("addAnnonce.selectType")}</option>
              {typeAnnonces.map((type) => (
                <option key={type.id} value={type.id}>
                  {lang === "ar" ? type.nameAr : type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="category"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              {t("addAnnonce.category")}
            </label>
            <select
              id="category"
              value={selectedCategoryId || ""}
              onChange={handleCategoryChange}
              disabled={!selectedTypeId}
              className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
            >
              <option value="">{t("addAnnonce.selectCategory")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {lang === "ar" ? category.nameAr : category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="subCategory"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              {t("addAnnonce.subCategory")}
            </label>
            <select
              id="subCategory"
              value={selectedSubCategoryId || ""}
              onChange={handleSubCategoryChange}
              disabled={!selectedCategory}
              className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
            >
              <option value="">{t("addAnnonce.selectSubCategory")}</option>
              {filteredSubCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {lang === "ar" ? subCategory.nameAr : subCategory.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              {t("addAnnonce.description")}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow-sm border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
              rows={4}
              required
            ></textarea>
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="prix"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              {t("addAnnonce.price")}
            </label>
            <input
              type="number"
              id="prix"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="shadow-sm border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              id="submit"
              className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
            >

              {submitting ? (
                    <div className="loader"></div>
            ) : (
              <span>{t("addAnnonce.submitButton")}</span>
            
                  
              )}
            </button>
            {submitStatus && <p>{submitStatus}</p>}
          </div>
        </form>
      </div>





      {/* CSS for the loader */}
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
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
