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
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Lieu {
  id: number | string;
  name: string;
  nameAr: string;
}

interface AnnonceType {
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

  // ── URL param values ──────────────────────────────────────────────────────
  const currentCategorieId = searchParams?.get("categorieId") || "all";
  const currentWilayaId = searchParams?.get("wilayaId") || "";
  const currentTypeAnnonceId = searchParams?.get("typeAnnonceId") || "";

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
  const [annonceTypes, setAnnonceTypes] = useState<AnnonceType[]>([]);
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

  // Fetch annonce types from /{locale}/p/api/tursor/options (depth=1)
  const fetchAnnonceTypes = useCallback(async () => {
    if (annonceTypes.length > 0) return;
    setLoadingTypes(true);
    try {
      const res = await fetch(`/${locale}/p/api/tursor/options`);
      const json = await res.json();
      setAnnonceTypes(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("Error fetching annonceTypes:", err);
    } finally {
      setLoadingTypes(false);
    }
  }, [locale, annonceTypes.length]);

  // Lazy-load on dropdown open
  useEffect(() => {
    if (regionOpen) fetchWilayas();
  }, [regionOpen, fetchWilayas]);

  useEffect(() => {
    if (typeOpen) fetchAnnonceTypes();
  }, [typeOpen, fetchAnnonceTypes]);

  // ── Categories ────────────────────────────────────────────────────────────
  const categories = [
    { id: "all", labelfr: "Accueil", labelar: "الرئيسية", icon: faHome, color: "text-gray-700" },
    { id: "6", labelfr: "Immobilier", labelar: "العقارات", icon: faBuilding, color: "text-gray-700" },
    { id: "10", labelfr: "Voiture", labelar: "السيارات", icon: faCar, color: "text-gray-700" },
    { id: "5", labelfr: "Appareils", labelar: "الأجهزة", icon: faDesktop, color: "text-gray-700" },
    { id: "3", labelfr: "Services", labelar: "خدمات", icon: faBriefcase, color: "text-gray-700" , typeAnnonceId: true },
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

  const handleCategorySelect = (id: string) => {
    if (id === "all") {
      pushParams({ categorieId: null, typeAnnonceId: null, wilayaId: null });
    } else {
      pushParams({ categorieId: id });
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

  const handleTypeSelect = (id: string | number) => {
    pushParams({ typeAnnonceId: String(id) });
    setTypeOpen(false);
  };

  const handleCategoryTypeSelect = (id: string) => {
    pushParams({ typeAnnonceId: String(id), categorieId: null });
    setTypeOpen(false);
  };

  const handleClearType = (e: React.MouseEvent) => {
    e.stopPropagation();
    pushParams({ typeAnnonceId: null });
  };

  // ── Derived labels ────────────────────────────────────────────────────────
  const selectedWilaya = wilayas.find((w) => String(w.id) === currentWilayaId);
  const selectedType = annonceTypes.find((a) => String(a.id) === currentTypeAnnonceId);
  const hasSelectedCategory = currentCategorieId !== "all" || !!currentTypeAnnonceId;

  const wilayaLabel = selectedWilaya
    ? isRTL ? selectedWilaya.nameAr : selectedWilaya.name
    : isRTL ? "جميع المناطق" : "Toutes les régions";

  const typeLabel = selectedType
    ? isRTL ? selectedType.nameAr : selectedType.name
    : isRTL ? "أنواع الاعلانات" : "Type d'annonces";

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
          const isActive = cat.typeAnnonceId
            ? currentTypeAnnonceId === cat.id
            : cat.id === "all"
              ? currentCategorieId === "all" && currentTypeAnnonceId !== '3'
              : currentCategorieId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={ cat.typeAnnonceId ? () => handleCategoryTypeSelect(cat.id) : () => handleCategorySelect(cat.id)}
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

        {/* ── Annonce Type Dropdown ────────────────────────────────────────── */}
        <div ref={typeRef} className="relative">
          <button
            onClick={() => { setTypeOpen((v) => !v); setRegionOpen(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 select-none ${
              currentTypeAnnonceId
                ? "bg-gradient-to-br from-blue-50 to-blue-100/80 border-blue-200 text-blue-700 shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <span>{typeLabel}</span>
            {currentTypeAnnonceId ? (
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
              ) : annonceTypes.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">
                  {isRTL ? "لا توجد أنواع" : "Aucun type"}
                </p>
              ) : (
                <>
                  {/* All types */}
                  <button
                    onClick={() => { pushParams({ typeAnnonceId: null }); setTypeOpen(false); }}
                    className={dropdownItem(!currentTypeAnnonceId)}
                  >
                    <span>{isRTL ? "الكل" : "Tout"}</span>
                    {!currentTypeAnnonceId && <FontAwesomeIcon icon={faCheck} className="text-blue-500 text-xs" />}
                  </button>

                  {annonceTypes.map((at) => {
                    const active = String(at.id) === currentTypeAnnonceId;
                    // if at.id is 3 then don't show it in the dropdown services in category types
                    if (at.id === 3) {
                      return null;
                    }
                    return (
                      <button
                        key={at.id}
                        onClick={() => handleTypeSelect(at.id)}
                        className={dropdownItem(active)}
                      >
                        <span>{isRTL ? at.nameAr : at.name}</span>
                        {active && <FontAwesomeIcon icon={faCheck} className="text-blue-500 text-xs" />}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
