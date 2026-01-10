"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Annonce } from "../../../../packages/mytypes/types";
//"@repo/mytypes/types";

import { useRouter } from "next/navigation";
import { useI18n } from "../../../../locales/client";
import Pagination from "../../ui/PaginationUI";
export default function PaginationUI(props: {
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();

  const handleClickToNextPage = () => {
    //const currentPage = Number(router.query.page) || 1;
    const nextPage = props.currentPage + 1;
    router.push(`?page=${nextPage}`);
  };

  const handleClickPrevPage = () => {
    //const currentPage = Number(router.query.page) || 1;
    const nextPage = props.currentPage - 1;
    router.push(`?page=${nextPage}`);
  };

  return (
    <div className="mt-8 flex gap-2 justify-center">
      <button
        onClick={() => handleClickPrevPage()}
        disabled={props.currentPage === 1}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 disabled:opacity-50"
      >
        Précédent
      </button>
      <span className="py-2 px-4">
        Page {props.currentPage} sur {props.totalPages}
      </span>
      <button
        onClick={() => handleClickToNextPage()}
        disabled={props.currentPage === props.totalPages}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  );
}

const fallbackImageUrl = "/noimage.jpg";

function AnnonceItemUI({
  annonce,
  lang = "ar",
}: {
  annonce: Annonce;
  lang: string;
  imageServiceUrl?: string; // Gardé pour compatibilité mais non utilisé
}) {
  const t = useI18n();
  const isAr = lang === "ar";
  
  const imgUrl = annonce.haveImage && annonce.firstImagePath 
    ? annonce.firstImagePath 
    : fallbackImageUrl;

  return (
      <article
        data-cy="annonce-item"
        className="group bg-white rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
             <Image
                src={imgUrl}
                alt={annonce.title || "annonce"}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                 <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                    {isAr ? annonce?.classificationAr : annonce?.classificationFr}
                 </span>
              </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-4 mb-3">
             <h2 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                {annonce.title ?? (isAr ? "بدون عنوان" : "Sans titre")}
             </h2>
             {annonce.price && (
                 <div className="flex flex-col items-end shrink-0">
                    <span className="text-lg font-extrabold text-primary-700">{annonce.price.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">UM</span>
                 </div>
             )}
          </div>
          
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow font-medium leading-relaxed">
             {annonce.description ?? "..."}
          </p>

          <div className="pt-4 mt-auto border-t border-gray-100">
             {annonce.privateDescription && (
              <div className="mb-3 p-2.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                 <span className="shrink-0 mt-0.5">🔒</span>
                 <div>
                    <span className="font-bold opacity-70 block text-[10px] uppercase tracking-wide mb-0.5">
                       {t("addAnnonce.privateDescription")}
                    </span>
                    <span className="line-clamp-2 leading-snug">{annonce.privateDescription}</span>
                 </div>
              </div>
            )}
            
             <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                 <span>
                    {annonce.createdAt 
                        ? new Date(annonce.createdAt).toLocaleDateString(isAr ? 'ar-MR' : 'fr-FR') 
                        : ""}
                 </span>
                 <span className="text-primary-600 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                    {t("common.details")} &rarr;
                 </span>
             </div>
          </div>
        </div>
      </article>
  );
}

export function MyListAnnoncesUI({
  totalPages,
  lang = "ar",
  currentPage,
  annonces,
}: {
  lang?: string;
  totalPages: number;
  currentPage: number;
  annonces: Annonce[];
  imageServiceUrl?: string;
}) {

  const t = useI18n();

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
             {t("filter.Annonces")}
            </h2>
            <div className="w-16 h-1 bg-primary-500 rounded-full mt-2"></div>
        </div>
        
        {annonces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {annonces.map((annonce) => (
                <Link
                href={`/${lang}/my/details/${annonce.id}`}
                key={annonce.id}
                className="block h-full"
                >
                <AnnonceItemUI annonce={annonce} lang={lang} />
                </Link>
            ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium text-lg">Aucune annonce trouvée</p>
                <Link href={`/${lang}/my/add`} className="mt-4 inline-block text-primary-600 font-bold hover:underline">
                    Créer une annonce
                </Link>
            </div>
        )}

        <div className="mt-12">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>
  );
}
