"use client";

import { useI18n } from "../../../locales/client";
import { useSearchParams, useRouter, usePathname} from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faBuilding,
  faDesktop,
  faCow,
  faCouch,
  faBriefcase,
  faHandshake,
  faShirt,
  faGamepad,
  faHome,
  faMapMarkerAlt,
  faGlobe,
  faList
} from "@fortawesome/free-solid-svg-icons";


export default function CategoryTypesUI({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useI18n();


  const currentCategorieId = searchParams?.get("categorieId") || "all";

  const categories = [
    { id: "all", labelfr: "Accueil",labelar:"الرئيسية", icon: faHome, color: "text-blue-600" },
    { id: "7", labelfr: "Voiture",labelar:"السيارات", icon: faCar, color: "text-blue-500" },
    { id: "6", labelfr: "Immobilier",labelar:"العقارات", icon: faBuilding, color: "text-blue-800" },
    { id: "5", labelfr: "Appareils",labelar:"الأجهزة", icon: faDesktop, color: "text-gray-700" },
    // { id: "4", label: "Furniture", icon: faCouch, color: "text-indigo-600" },
    // { id: "jobs", label: "Jobs", icon: faBriefcase, color: "text-blue-600" },
    // { id: "services", label: "Services", icon: faHandshake, color: "text-teal-600" },
    // { id: "fashion", label: "Fashion", icon: faShirt, color: "text-purple-600" },
    // { id: "games", label: "Games", icon: faGamepad, color: "text-blue-500" },
  ];

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (id === "all") {
      params.delete("categorieId");
    } else {
      params.set("categorieId", id);
    }
    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  return (
    <div className="w-full bg-white pb-4">
      {/* Grid of Categories */}
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2 px-4 pt-4">
        {categories.map((cat) => {
          const isActive = currentCategorieId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className="flex flex-col items-center justify-center gap-2 group focus:outline-none"
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl transition-all ${
                  isActive
                    ? "bg-blue-50 border-2 border-blue-200 shadow-sm"
                    : "bg-gray-50 border border-transparent group-hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={cat.icon}
                  className={`text-2xl md:text-3xl ${cat.color} ${isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}
                />
              </div>
              <span
                className={`text-xs md:text-sm text-center font-medium ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {locale === "fr" ? cat.labelfr : cat.labelar}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Buttons (All regions, Near, etc.) */}
      {/* <div className="flex items-center gap-3 px-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg whitespace-nowrap text-sm font-medium text-gray-700 hover:bg-gray-100">
          <span>All regions</span>
          <span className="text-gray-400 text-xs">▼</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg whitespace-nowrap text-sm font-medium text-gray-700 hover:bg-gray-100">
          <span>Near</span>
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg whitespace-nowrap text-sm font-medium text-gray-700 hover:bg-gray-100">
          <span dir="rtl">سكهـب</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg whitespace-nowrap text-sm font-medium text-gray-700 hover:bg-gray-100">
          <FontAwesomeIcon icon={faList} className="text-gray-500" />
        </button>
      </div> */}
    </div>
  );
}
