import { Annonce } from "../../../packages/mytypes/types";
import PaginationUI from "./PaginationUI";
import AnnonceItemUI from "../../../packages/ui/components/AllAnonnce/AnnonceItemUI";

export default function ListAnnoncesUI({
  totalPages,
  currentPage,
  annonces,
  imageServiceUrl,
  lang,
  favoriteIds = [],
}: {
  totalPages: number;
  currentPage: number;
  annonces: Annonce[];
  imageServiceUrl?: string;
  lang?: string;
  favoriteIds?: string[];
}) {
  const hasItems = annonces && annonces.length > 0;

  return (
    <div className="container px-2 md:px-4">
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
                href={`${lang}/p/annonces/details/${a.id}`}
                isFavorite={favoriteIds.includes(String(a.id))} // <—
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
