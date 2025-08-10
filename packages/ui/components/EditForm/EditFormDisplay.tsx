import React from "react";

interface EditFormDisplayProps {
  editTitle: string;
  annonceTypeLabel: string;
  categoryLabel: string;
  selectCategoryLabel: string;
  subCategoryLabel: string;
  selectSubCategoryLabel: string;
  descriptionLabel: string;
  priceLabel: string;
  cancelLabel: string;
  updateLabel: string;
  typeAnnonces: any[];
  categories: any[];
  filteredSubCategories: any[];
  selectedTypeId: string;
  setSelectedTypeId: (id: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  selectedSubCategoryId: string;
  setSelectedSubCategoryId: (id: string) => void;
  description: string;
  setDescription: (description: string) => void;
  price: string;
  setPrice: (price: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  lang: string;
}

const EditFormDisplay: React.FC<EditFormDisplayProps> = ({
  editTitle,
  annonceTypeLabel,
  categoryLabel,
  selectCategoryLabel,
  subCategoryLabel,
  selectSubCategoryLabel,
  descriptionLabel,
  priceLabel,
  cancelLabel,
  updateLabel,
  typeAnnonces,
  categories,
  filteredSubCategories,
  selectedTypeId,
  setSelectedTypeId,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedSubCategoryId,
  setSelectedSubCategoryId,
  description,
  setDescription,
  price,
  setPrice,
  handleSubmit,
  onClose,
  lang,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{editTitle}</h2>
        <form onSubmit={handleSubmit}>
          {/* Type Annonce */}
          <div className="mb-4">
            <label className="block mb-1">{annonceTypeLabel}</label>
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(String(e.target.value))}
              className="border rounded w-full p-2"
            >
              {typeAnnonces.map((type) => (
                <option key={type.id} value={type.id}>
                  {lang === "ar" ? type.nameAr : type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Catégorie */}
          <div className="mb-4">
            <label className="block mb-1">{categoryLabel}</label>
            <select
              value={selectedCategoryId || ""}
              onChange={(e) => setSelectedCategoryId(String(e.target.value))}
              disabled={!selectedTypeId}
              className="border rounded w-full p-2"
            >
              <option value="">{selectCategoryLabel}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sous-catégorie */}
          <div className="mb-4">
            <label className="block mb-1">{subCategoryLabel}</label>
            <select
              value={selectedSubCategoryId || ""}
              onChange={(e) => setSelectedSubCategoryId(String(e.target.value))}
              disabled={!selectedCategoryId}
              className="border rounded w-full p-2"
            >
              <option value="">{selectSubCategoryLabel}</option>
              {filteredSubCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-1">{descriptionLabel}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded w-full p-2"
              rows={4}
              required
            />
          </div>

          {/* Prix */}
          <div className="mb-4">
            <label className="block mb-1">{priceLabel}</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border rounded w-full p-2"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-300 p-2 rounded"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              className="bg-blue-500 p-2 rounded text-white"
            >
              {updateLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFormDisplay;
