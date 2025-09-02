"use client";

import { Annonce } from "../../../packages/mytypes/types";
import PaginationUI from "./PaginationUI";
import AnnonceItemUI from "../../../packages/ui/components/AllAnonnce/AnnonceItemUI";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "../../../locales/client";

export default function ListAnnoncesUI({
  totalPages,
  currentPage,
  annonces,
  imageServiceUrl,
  lang,
  favoriteIds = [],
  showSamsarToggle = false,
  title, // ⬅️ nouveau: on affiche le titre ici pour pouvoir aligner les filtres en face
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
  const hasItems = annonces && annonces.length > 0;

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const t = useI18n();

  // RTL/LTR
  const isRTL = (lang ?? "").startsWith("ar");

  console.log("favoriteIds ::" , favoriteIds)

  

// Vérifie si on est dans /my (ex: /fr/my ou /fr/my/favorites)
  const inMySection = pathname.includes("/my");


  // état actuel depuis l'URL
  const samsarChecked = sp.get("issmar") === "true";
  const dn = sp.get("directNegotiation"); // "true" | "false" | null
  const dnState: "any" | "true" | "false" =
    dn === "true" ? "true" : dn === "false" ? "false" : "any";

  const pushParams = (mutate: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(sp.toString());
    mutate(params);
    params.delete("page"); // reset pagination
    router.push(`${pathname}?${params.toString()}`);
  };

  const onToggleSamsar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      pushParams((p) => p.set("issmar", "true"));
    } else {
      // si on décoche samsar, on enlève aussi directNegotiation
      pushParams((p) => {
        p.delete("issmar");
        p.delete("directNegotiation");
      });
    }
  };

  const setDirect = (state: "any" | "true" | "false") => {
    pushParams((p) => {
      p.set("issmar", "true"); // on garde issmar actif
      if (state === "any") p.delete("directNegotiation");
      if (state === "true") p.set("directNegotiation", "true");
      if (state === "false") p.set("directNegotiation", "false");
    });
  };

  return (
    <div className="container px-2 md:px-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* En-tête: Titre à un côté, filtres à l'autre */}
      <div className="mb-3 md:mb-4 flex items-center justify-between gap-3">
        {title ? (
          <h2 className="text-base md:text-lg font-semibold text-gray-800">
            {title}
          </h2>
        ) : (
          <div />
        )}

        {showSamsarToggle && (
          <div className="flex items-center gap-3">
            {/* Switch moderne pour "Samsar seulement" */}
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={samsarChecked}
                onChange={onToggleSamsar}
              />
              <span className="relative inline-block w-10 h-6 rounded-full bg-gray-300 transition peer-checked:bg-blue-600">
                <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
              </span>
              <span className="text-xs sm:text-sm text-gray-700">
                {t("filter.samsarOnly")}
              </span>
            </label>

            {/* Segmented control pour “Négociation directe” (visible si samsar actif) */}
            {samsarChecked && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-gray-600">
                  {t("filter.directNegotiation")}
                </span>
                <div className="inline-flex overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setDirect("any")}
                    className={
                      "px-3 py-1.5 text-xs sm:text-sm transition " +
                      (dnState === "any"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-50")
                    }
                  >
                    {t("filter.any")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirect("true")}
                    className={
                      "px-3 py-1.5 text-xs sm:text-sm border-l border-gray-300 transition " +
                      (dnState === "true"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-50")
                    }
                  >
                    {t("filter.yes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirect("false")}
                    className={
                      "px-3 py-1.5 text-xs sm:text-sm border-l border-gray-300 transition " +
                      (dnState === "false"
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-50")
                    }
                  >
                    {t("filter.no")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hasItems ? (
        <>
          <div
            aria-label="Liste des annonces"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {annonces.map((a) => (
              <AnnonceItemUI
                key={a.id}
                {...a}
                lang={lang}
                imageServiceUrl={imageServiceUrl}
                href={
                  inMySection
                    ? `/${lang}/p/annonces/details/${a.id}` // ✅ lien "propre"
                    : `/${lang}/p/annonces/details/${a.id}`
                }
                isFavorite={favoriteIds.includes(String(a.id))}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <PaginationUI totalPages={totalPages} currentPage={currentPage} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
          <p className="text-lg">Aucune annonce trouvée.</p>
          <p className="text-sm">Modifie les filtres pour voir des résultats.</p>
        </div>
      )}
    </div>
  );
}
