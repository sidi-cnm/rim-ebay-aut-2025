"use client";

import { Annonce } from "../../../packages/mytypes/types";
import PaginationUI from "./PaginationUI";
import AnnonceItemUI from "../../../packages/ui/components/AllAnonnce/AnnonceItemUI";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "../../../locales/client";
import { FaCar, FaMapMarkerAlt,FaMoneyBillWave,FaHome } from "react-icons/fa"; // ajouter en haut du fichier

export default function ListAnnoncesUI({
  totalPages,
  currentPage,
  annonces,
  imageServiceUrl,
  lang,
  favoriteIds = [],
  showSamsarToggle = false,
  title,
}: {
  totalPages: number;
  currentPage: number;
  annonces: Annonce[];
  imageServiceUrl?: string;
  lang?: string;
  favoriteIds?: string[];
  showSamsarToggle?: boolean;
  title?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const t = useI18n();

  const isRTL = (lang ?? "").startsWith("ar");

  // Détecte si on est sur la page principale ("/" ou "/fr/")
  const isMainPage = pathname === `/${lang}` || pathname === `/`;

  const mainChoice = sp.get("mainChoice") as "Location" | "Vente" | null;
  const subChoice = sp.get("subChoice") as "voitures" | "Maisons" | null;
  const samsarChecked = sp.get("issmar") === "true";
  const dn = sp.get("directNegotiation");
  const dnState: "any" | "true" | "false" =
    dn === "true" ? "true" : dn === "false" ? "false" : "any";

  const pushParams = (mutate: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(sp.toString());
    mutate(params);
    params.delete("page"); // reset pagination
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateChoice = (key: "mainChoice" | "subChoice", value: string | null) => {
    pushParams((p) => {
      if (value) p.set(key, value);
      else p.delete(key);
      if (key === "mainChoice" && value === null) p.delete("subChoice");
    });
  };

  const onToggleSamsar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) pushParams((p) => p.set("issmar", "true"));
    else pushParams((p) => { p.delete("issmar"); p.delete("directNegotiation"); });
  };

  const setDirect = (state: "any" | "true" | "false") => {
    pushParams((p) => {
      p.set("issmar", "true");
      if (state === "any") p.delete("directNegotiation");
      if (state === "true") p.set("directNegotiation", "true");
      if (state === "false") p.set("directNegotiation", "false");
    });
  };

  const hasItems = annonces && annonces.length > 0;

  return (
    <div className="container mx-auto px-2 md:px-4" >
      {/* En-tête: Titre */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        <button
          onClick={() => router.push(`/${lang}/`)} // Retour à la page principale
          className="text-base md:text-lg font-semibold text-blue-600 hover:underline"
        >
          {title} 
        </button>
        {/* Filtres affichés seulement sur la page principale */}
        {isMainPage && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* MainChoice */}
            <div className="inline-flex rounded-xl border border-gray-300 overflow-hidden shadow-sm flex-1 sm:flex-none w-full sm:w-auto">
            <button
              className={`flex items-center gap-2 flex-1 px-3 py-1.5 text-sm ${
                mainChoice === "Location"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() =>
                updateChoice("mainChoice", mainChoice === "Location" ? null : "Location")
              }
            >
              <FaMapMarkerAlt
                className={`w-5 h-5 ${
                  mainChoice === "Location" ? "text-white" : "text-blue-500"
                }`}
              />
              <span>{t("card.location")}</span>
            </button>

            <span className="w-px bg-gray-300" />
            <button
              className={`flex items-center gap-2 flex-1 px-3 py-1.5 text-sm border-l border-gray-300 ${
                mainChoice === "Vente"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() =>
                updateChoice("mainChoice", mainChoice === "Vente" ? null : "Vente")
              }
            >
              <FaMoneyBillWave
                className={`w-5 h-5 ${
                  mainChoice === "Vente" ? "text-white" : "text-green-500"
                }`}
              />
              <span>{t("card.sale")}</span>
            </button>
          </div>

            {/* SubChoice (si mainChoice) */}
            {mainChoice && (
              <div className="inline-flex rounded-xl border border-gray-300 overflow-hidden shadow-sm flex-1 sm:flex-none w-full sm:w-auto">
              <button
                className={`flex items-center gap-2 flex-1 px-3 py-1.5 text-sm ${
                  subChoice === "voitures"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() =>
                  updateChoice("subChoice", subChoice === "voitures" ? null : "voitures")
                }
              >
                <FaCar
                  className={`w-5 h-5 ${
                    subChoice === "voitures" ? "text-white" : "text-blue-500"
                  }`}
                />
                <span>{t("card.voiture")}</span>
              </button>

              <span className="w-px bg-gray-300" />
            
              <button
                className={`flex items-center gap-2 flex-1 px-3 py-1.5 text-sm border-l border-gray-300 ${
                  subChoice === "Maisons"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() =>
                  updateChoice("subChoice", subChoice === "Maisons" ? null : "Maisons")
                }
              >
                <FaHome
                  className={`w-5 h-5 ${
                    subChoice === "Maisons" ? "text-white" : "text-green-500"
                  }`}
                />
                <span>{t("card.maison")}</span>
              </button>
            </div>
            
            )}

            {/* Samsar */}
            {showSamsarToggle && (
              <div className="flex items-center gap-3 mt-2 sm:mt-0 flex-wrap">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="sr-only peer" checked={samsarChecked} onChange={onToggleSamsar} />
                  <span className="relative inline-block w-10 h-6 rounded-full bg-gray-300 transition peer-checked:bg-blue-600">
                    <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                  </span>
                  <span className="text-xs sm:text-sm text-gray-700">{t("filter.samsarOnly")}</span>
                </label>

                {samsarChecked && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="hidden sm:inline text-xs text-gray-600">{t("filter.directNegotiation")}</span>
                    <div className="inline-flex overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => setDirect("any")}
                        className={`px-3 py-1.5 text-xs sm:text-sm transition ${dnState === "any" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        {t("filter.any")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDirect("true")}
                        className={`px-3 py-1.5 text-xs sm:text-sm border-l border-gray-300 transition ${dnState === "true" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        {t("filter.yes")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDirect("false")}
                        className={`px-3 py-1.5 text-xs sm:text-sm border-l border-gray-300 transition ${dnState === "false" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        {t("filter.no")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Liste annonces */}
      {hasItems ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {annonces.map((a) => (
              <AnnonceItemUI
                key={a.id}
                {...a}
                lang={lang}
                imageServiceUrl={imageServiceUrl}
                href={`/${lang}/p/annonces/details/${a.id}`}
                isFavorite={favoriteIds.includes(String(a.id))}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <PaginationUI totalPages={totalPages} currentPage={currentPage} />
          </div>
        </>
      ) : (
        <div>
          
          <p className="text-lg">{t("card.Noitem")}</p>
        </div>
      )}
    </div>
  );
}
