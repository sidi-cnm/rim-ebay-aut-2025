import Link from "next/link";
import { Annonce } from "../../../packages/mytypes/types";
//"@repo/mytypes/types";
import PaginationUI from "./PaginationUI";
import AnnonceItemUI from "../../../packages/ui/components/AllAnonnce/AnnonceItemUI";
//"@repo/ui/AllAnonnce/AnnonceItemUI";
export default function ListAnnoncesUI({
  totalPages,
  currentPage,
  annonces,
}: {
  totalPages: number;
  currentPage: number;
  annonces: Annonce[];
}) {
  return (
    <div className="container  px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {annonces.map((annonce) => (
          <Link
            href={`/p/annonces/details/${annonce.id}`}
            key={annonce.id}
            className="block"
          >
            <AnnonceItemUI {...annonce} />
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <PaginationUI totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
