"use server";
import BackButton from "../../../../../../packages/ui/components/Navigation";
// "@repo/ui/Navigation";
import AnnonceDetailCompo from "../../../../../../packages/ui/components/All_AnnonceDetaille/AnnonceDetailUI";
//"@repo/ui/All_AnnonceDetaille/AnnonceDetailUI";
import { Annonce } from "../../../../../../packages/mytypes/types";
//"@repo/mytypes/types";
import prisma from "../../../../../../lib/prisma"; 

export default async function AnnonceDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  // Recherche de l'annonce en base de données
  const annonce = await prisma.annonce.findUnique({
    where: { id: params.id },
  }); 
  const contactObject = await prisma.contact.findFirst({
    where: { userId: annonce?.userId },
  });

  // Vérification si l'annonce existe
  if (!annonce) {
    throw new Error(`Annonce avec l'ID ${params.id} non trouvée`);
  }

  const { firstImagePath, ...annonceData } = annonce;
  const formattedAnnonce: Annonce = {
    ...annonceData,
    price: parseFloat(String(annonce.price)),
    firstImagePath: firstImagePath ? String(firstImagePath) : "",
    lieuStr: "", // These will be populated if needed
    lieuStrAr: "",
    images: [],
  };
  if (contactObject && contactObject.contact) {
    formattedAnnonce.contact = contactObject.contact;
  } else {
    formattedAnnonce.contact = "Contact non trouvé";
  } 
  
 

  if (!annonce) {
    return (
      <h1 className="text-2xl font-bold text-center mt-8">
        Annonce non trouvée
      </h1>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-9 overflow-hidden">
      <div className="md:ml-32 lg:ml-44">
        <BackButton />
      </div>

      <div>
        <AnnonceDetailCompo
          annonceId={params.id}
          annonce={formattedAnnonce}
          imageServiceUrl="https://picsum.photos"
        />
      </div>
    </div>
  );
}
