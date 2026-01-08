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
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            
            {/* MainChoice Toggle */}
            <div className="inline-flex p-1 bg-gray-100 rounded-2xl shadow-inner w-full sm:w-auto">
              {["Location", "Vente"].map((type) => {
                const isActive = mainChoice === type;
                return (
                  <button
                    key={type}
                    onClick={() => updateChoice("mainChoice", isActive ? null : type)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-primary-600 shadow-sm ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }`}
                  >
                    {type === "Location" ? (
                      <FaMapMarkerAlt className={isActive ? "text-primary-500" : "text-gray-400"} />
                    ) : (
                      <FaMoneyBillWave className={isActive ? "text-emerald-500" : "text-gray-400"} />
                    )}
                    <span>{type === "Location" ? t("card.location") : t("card.sale")}</span>
                  </button>
                );
              })}
            </div>

            {/* SubChoice (si mainChoice) */}
            {mainChoice && (
               <div className="inline-flex p-1 bg-gray-100 rounded-2xl shadow-inner w-full sm:w-auto animate-in fade-in slide-in-from-left-4 duration-300">
                {["voitures", "Maisons"].map((sub) => {
                  const isActive = subChoice === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => updateChoice("subChoice", isActive ? null : sub)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-white text-primary-600 shadow-sm ring-1 ring-black/5"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                      }`}
                    >
                      {sub === "voitures" ? (
                         <FaCar className={isActive ? "text-primary-500" : "text-gray-400"} />
                      ) : (
                         <FaHome className={isActive ? "text-emerald-500" : "text-gray-400"} />
                      )}
                      <span>{sub === "voitures" ? t("card.voiture") : t("card.maison")}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Samsar Toggle */}
            {showSamsarToggle && (
              <div className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm">
                <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" className="sr-only peer" checked={samsarChecked} onChange={onToggleSamsar} />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  <span className="text-sm font-semibold text-gray-700">{t("filter.samsarOnly")}</span>
                </label>

                {samsarChecked && (
                   <div className="h-6 w-px bg-gray-200 mx-2" />
                )}

                {samsarChecked && (
                   <div className="flex bg-gray-100 p-0.5 rounded-lg">
                      {["any", "true", "false"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setDirect(opt as any)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                            dnState === opt
                              ? "bg-white text-primary-700 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {opt === "any" ? t("filter.any") : opt === "true" ? t("filter.yes") : t("filter.no")}
                        </button>
                      ))}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {annonces.map((a) => (
              <AnnonceItemUI
                key={a.id}
                {...a}
                lang={lang}
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
