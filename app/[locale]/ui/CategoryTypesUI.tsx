"use client";

import { useI18n } from "../../../locales/client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faBuilding,
  faDesktop,
  faHome,
  faMapMarkerAlt,
  faChevronDown,
  faChevronUp,
  faTimes,
  faCheck,
  faBriefcase,
  faHandshake,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Lieu {
  id: number | string;
  name: string;
  nameAr: string;
}

interface OptionItem {
  id: number | string;
  name: string;
  nameAr: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CategoryTypesUI({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useI18n();

  const isRTL = locale === "ar";

  const currentTypeAnnonceId = searchParams?.get("typeAnnonceId") || "";
  const currentCategorieId = searchParams?.get("categorieId") || "";
  const currentWilayaId = searchParams?.get("wilayaId") || "";

  // ── Dropdown open state ───────────────────────────────────────────────────
  const [regionOpen, setRegionOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const regionRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Data fetched from tursor ───────────────────────────────────────────────
  const [wilayas, setWilayas] = useState<Lieu[]>([]);
  const [categorieOptions, setCategorieOptions] = useState<OptionItem[]>([]);
  const [loadingWilayas, setLoadingWilayas] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Fetch wilayas from /{locale}/p/api/tursor/lieux?tag=wilaya
  const fetchWilayas = useCallback(async () => {
    if (wilayas.length > 0) return;
    setLoadingWilayas(true);
    try {
      const res = await fetch(`/${locale}/p/api/tursor/lieux?tag=wilaya`);
      const json = await res.json();
      setWilayas(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      console.error("Error fetching wilayas:", err);
    } finally {
      setLoadingWilayas(false);
    }
  }, [locale, wilayas.length]);

  const fetchCategorieOptions = useCallback(async (parentId: string) => {
    setLoadingTypes(true);
    try {
      const res = await fetch(`/${locale}/p/api/tursor/options?parentId=${parentId}`);
      const json = await res.json();
      setCategorieOptions(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("Error fetching categorieOptions:", err);
    } finally {
      setLoadingTypes(false);
    }
  }, [locale]);

  useEffect(() => {
    if (regionOpen) fetchWilayas();
  }, [regionOpen, fetchWilayas]);

  useEffect(() => {
    if (currentTypeAnnonceId && typeOpen) {
      fetchCategorieOptions(currentTypeAnnonceId);
    }
  }, [currentTypeAnnonceId, typeOpen, fetchCategorieOptions]);

  const categories = [
    { id: "all", labelfr: "Accueil", labelar: "الرئيسية", icon: faHome, color: "text-gray-700" },
    { id: "1", labelfr: "Maison", labelar: "عقارات", icon: faBuilding, color: "text-gray-700" },
    { id: "2", labelfr: "Voiture", labelar: "سيارات", icon: faCar, color: "text-gray-700" },
    { id: "3", labelfr: "Électronique", labelar: "إلكترونيات", icon: faDesktop, color: "text-gray-700" },
    { id: "4", labelfr: "Services", labelar: "خدمات", icon: faBriefcase, color: "text-gray-700" },
    { id: "5", labelfr: "Demande", labelar: "طلب", icon: faHandshake, color: "text-gray-700" },
    //{ id: "6", labelfr: "Autre", labelar: "أخرى", icon: faEllipsisH, color: "text-gray-700" },
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────
  const pushParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  const handleTypeSelect = (id: string) => {
    if (id === "all") {
      pushParams({ typeAnnonceId: null, categorieId: null, wilayaId: null });
    } else {
      pushParams({ typeAnnonceId: id, categorieId: null });
    }
  };

  const handleWilayaSelect = (id: string | number) => {
    pushParams({ wilayaId: String(id) });
    setRegionOpen(false);
  };

  const handleClearWilaya = (e: React.MouseEvent) => {
    e.stopPropagation();
    pushParams({ wilayaId: null });
  };

  const handleCategorieSelect = (id: string | number) => {
    pushParams({ categorieId: String(id) });
    setTypeOpen(false);
  };

  const handleClearType = (e: React.MouseEvent) => {
    e.stopPropagation();
    pushParams({ typeAnnonceId: null, categorieId: null });
  };

  const selectedWilaya = wilayas.find((w) => String(w.id) === currentWilayaId);
  const selectedCategorie = categorieOptions.find((c) => String(c.id) === currentCategorieId);
  const hasSelectedCategory = !!currentTypeAnnonceId;

  const wilayaLabel = selectedWilaya
    ? isRTL ? selectedWilaya.nameAr : selectedWilaya.name
    : isRTL ? "جميع المناطق" : "Toutes les régions";

  const categorieLabel = selectedCategorie
    ? isRTL ? selectedCategorie.nameAr : selectedCategorie.name
    : isRTL ? "القسم" : "Catégorie";

  const isLeafType = currentTypeAnnonceId === "5" || currentTypeAnnonceId === "6";

  // ── Shared dropdown item styles ───────────────────────────────────────────
  const dropdownItem = (active: boolean) =>
    `w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all duration-150 rounded-lg ${
      active ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-600 hover:bg-blue-50/50 hover:text-gray-900"
    }`;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-white pb-4 ">
      {/* Grid of Categories */}
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2 px-4 pt-4 relative">
        {categories.map((cat) => {
          const isActive = cat.id === "all"
            ? !currentTypeAnnonceId
            : currentTypeAnnonceId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleTypeSelect(cat.id)}
              className="flex flex-col items-center justify-center gap-2 group focus:outline-none"
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200/40 scale-105"
                    : "bg-white border border-gray-200 shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 group-hover:border-blue-200/50"
                }`}
              >
                <FontAwesomeIcon
                  icon={cat.icon}
                  className={`text-xl md:text-2xl transition-all duration-200 ${
                    isActive ? "text-white scale-110 drop-shadow-sm" : `${cat.color} opacity-70 group-hover:opacity-100 group-hover:scale-105`
                  }`}
                />
              </div>
              <span
                className={`text-[11px] md:text-xs text-center font-semibold tracking-tight transition-colors duration-200 ${
                  isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                {isRTL ? cat.labelar : cat.labelfr}
              </span>
            </button>
          );
        })}
      </div>

      {hasSelectedCategory && (
        <>
      {/* Divider */}
      <div className="mx-4 mt-5 mb-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Filter Buttons Row */}
      <div
        className="flex items-center gap-3 px-4 pb-2"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* ── Region Dropdown ─────────────────────────────────────────────── */}
        <div ref={regionRef} className="relative">
          <button
            onClick={() => { setRegionOpen((v) => !v); setTypeOpen(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 select-none ${
              currentWilayaId
                ? "bg-gradient-to-br from-blue-50 to-blue-100/80 border-blue-200 text-blue-700 shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
            <span>{wilayaLabel}</span>
            {currentWilayaId ? (
              <span onClick={handleClearWilaya} className="ms-1 cursor-pointer text-blue-400 hover:text-blue-700 transition-colors">
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
              </span>
            ) : (
              <FontAwesomeIcon
                icon={regionOpen ? faChevronUp : faChevronDown}
                className="text-gray-400 text-xs transition-transform duration-200"
              />
            )}
          </button>

          {/* Dropdown panel */}
          {regionOpen && (
            <div className="absolute top-full mt-2 z-50 bg-white border border-gray-100 rounded-xl shadow-xl shadow-black/5 ring-1 ring-black/5 w-56 max-h-64 overflow-y-auto py-1.5">
              {loadingWilayas ? (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : wilayas.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">
                  {isRTL ? "لا توجد مناطق" : "Aucune région"}
                </p>
              ) : (
                <>
                  {/* All regions */}
                  <button
                    onClick={() => { pushParams({ wilayaId: null }); setRegionOpen(false); }}
                    className={dropdownItem(!currentWilayaId)}
                  >
                    <span>{isRTL ? "جميع المناطق" : "Toutes les régions"}</span>
                    {!currentWilayaId && <FontAwesomeIcon icon={faCheck} className="text-blue-500 text-xs" />}
                  </button>

                  {wilayas.map((w) => {
                    const active = String(w.id) === currentWilayaId;
                    return (
                      <button
                        key={w.id}
                        onClick={() => handleWilayaSelect(w.id)}
                        className={dropdownItem(active)}
                      >
                        <span>{isRTL ? w.nameAr : w.name}</span>
                        {active && <FontAwesomeIcon icon={faCheck} className="text-blue-500 text-xs" />}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Categorie Dropdown ────────────────────────────────────────────── */}
        {!isLeafType && (
        <div ref={typeRef} className="relative">
          <button
            onClick={() => { setTypeOpen((v) => !v); setRegionOpen(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 select-none ${
              currentCategorieId
                ? "bg-gradient-to-br from-blue-50 to-blue-100/80 border-blue-200 text-blue-700 shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <span>{categorieLabel}</span>
            {currentCategorieId ? (
              <span onClick={handleClearType} className="ms-1 cursor-pointer text-blue-400 hover:text-blue-700 transition-colors">
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
              </span>
            ) : (
              <FontAwesomeIcon
                icon={typeOpen ? faChevronUp : faChevronDown}
                className="text-gray-400 text-xs transition-transform duration-200"
              />
            )}
          </button>

          {/* Dropdown panel */}
          {typeOpen && (
            <div className="absolute top-full mt-2 z-40 bg-white border border-gray-100 rounded-xl shadow-xl shadow-black/5 ring-1 ring-black/5 w-48 max-h-64 overflow-y-auto py-1.5">
              {loadingTypes ? (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : categorieOptions.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">
                  {isRTL ? "لا توجد أقسام" : "Aucune catégorie"}
                </p>
              ) : (
                <>
                  <button
                    onClick={() => { pushParams({ categorieId: null }); setTypeOpen(false); }}
                    className={dropdownItem(!currentCategorieId)}
                  >
                    <span>{isRTL ? "الكل" : "Tout"}</span>
                    {!currentCategorieId && <FontAwesomeIcon icon={faCheck} className="text-blue-500 text-xs" />}
                  </button>

                  {categorieOptions.map((opt) => {
                    const active = String(opt.id) === currentCategorieId;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleCategorieSelect(opt.id)}
                        className={dropdownItem(active)}
                      >
                        <span>{isRTL ? opt.nameAr : opt.name}</span>
                        {active && <FontAwesomeIcon icon={faCheck} className="text-blue-500 text-xs" />}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
