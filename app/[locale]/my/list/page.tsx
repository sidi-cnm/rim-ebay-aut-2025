import { MyListAnnoncesUI } from "./ui";
import { LottieAnimation } from "../../../../packages/ui/components/LottieAnimation";
//"@repo/ui/LottieAnimation";
import { cookies } from "next/headers";
import prisma from "../../../../lib/prisma";
//import { Annonce } from "@/annonce.interface";
import { Annonce } from "../../../../packages/mytypes/types";
//"@repo/mytypes/types";
import { FormSearchUI } from "../../../../packages/ui/components/FormSearchUI";
//"@repo/ui/FormSearchUI";
import { getUserFromCookies } from "../../../../utiles/getUserFomCookies";



export default async function Home(props: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    page?: string;
    typeAnnonceId?: string;
    categorieId?: string;
    subCategorieId?: string;
    price?: string;
  }>;
}) {

  const userData = await getUserFromCookies();
  console.log("User Data:", userData);
  const userId = userData && userData.id ? userData.id : ""

  const searchParams = await props.searchParams;
  const params = await props.params;
  const currentPage = Number(searchParams?.page) || 1;
  // Extract filter params from searchParams
  const typeAnnonceId = searchParams?.typeAnnonceId;
  const categorieId = searchParams?.categorieId;
  const subCategorieId = searchParams?.subCategorieId;
  const price = searchParams?.price;

  // Build the where clause for filtering (always filter by userId)
  const where: any = { userId };
  if (typeAnnonceId && typeAnnonceId !== "") where.typeAnnonceId = typeAnnonceId;
  if (categorieId && categorieId !== "") where.categorieId = categorieId;
  if (subCategorieId && subCategorieId !== "") where.subcategorieId = subCategorieId;
  if (price && price !== "" && !isNaN(Number(price))) where.price = Number(price);

  const annoncesFromDB = await prisma.annonce.findMany({ where });

  const annonces: Annonce[] = annoncesFromDB.map((annonce) => ({
    id: annonce.id,
    typeAnnonceId: annonce.typeAnnonceId,
    typeAnnonceid: annonce.typeAnnonceId,
    typeAnnonceName: (annonce as any).type_annonce?.name ?? "",
    typeAnnonceNameAr: (annonce as any).type_annonce?.nameAr ?? "",
    categorieId: annonce.categorieId,
    categorieid: annonce.categorieId,
    categorieName: (annonce as any).categorie?.name ?? "",
    categorieNameAr: (annonce as any).categorie?.nameAr ?? "",
    lieuId: annonce.lieuId,
    lieuid: annonce.lieuId,
    lieuStr: "",
    lieuStrAr: "",

    userId: annonce.userId,
    userid: annonce.userId,
    title: annonce.title,
    description: annonce.description,
    price: parseFloat(String(annonce.price)),
    contact: annonce.contact,

    haveImage: annonce.haveImage,
    firstImagePath: String(annonce.firstImagePath),
    images: (annonce as any).annonceImages ?? [],

    status: annonce.status,
    updatedAt: annonce.updatedAt,
    createdAt: annonce.createdAt,
  }));

  const itemsPerPage = 6; // Define the number of items per page

  const totalPages = Math.ceil(annonces.length / itemsPerPage); // Calculate total pages based on your logic

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Mobile Filter Button/Modal */}
      <div className="block md:hidden w-full px-2 pt-4">
        <FormSearchUI lang={params.locale} modeOptionsApi="sqlite" mobile />
      </div>
      <div className="flex flex-col md:flex-row min-h-screen max-w-screen-2xl mx-auto gap-6 px-2 md:px-4 py-4 md:py-8">
        {/* Sidebar (only on md+) */}
        <div className="hidden md:block md:basis-1/5 md:w-1/5">
          <FormSearchUI lang={params.locale} modeOptionsApi="sqlite" />
        </div>
        {/* Main Content */}
        <section className="flex-1 bg-white rounded-2xl shadow-lg p-4 md:p-8 min-w-0">
          {annonces ? (
            <MyListAnnoncesUI
              totalPages={totalPages}
              currentPage={currentPage}
              annonces={annonces}
              lang={params.locale}
            />
          ) : (
            <div className="flex justify-center items-center">
              <LottieAnimation />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
