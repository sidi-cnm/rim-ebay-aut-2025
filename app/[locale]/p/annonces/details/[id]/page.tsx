import BackButton from "../../../../../../packages/ui/components/Navigation";
import AnnonceDetailCompo from "../../../../../../packages/ui/components/All_AnnonceDetaille/AnnonceDetailUI";
import { Annonce } from "../../../../../../packages/mytypes/types";

import { getDb } from "../../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function AnnonceDetail({
  params,
}: {
  params: { id: string };
}) {
  const db = await getDb();

  // 1) Construire la requête par _id (ObjectId) avec fallback si id n'est pas un ObjectId valide
  const id = params.id;
  const query =
    ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id as any };

  // 2) Récupérer l'annonce
  const doc = await db.collection("annonces").findOne(query);

  if (!doc) {
    return (
      <h1 className="text-2xl font-bold text-center mt-8">
        Annonce non trouvée
      </h1>
    );
  }

  // 3) Récupérer le contact de l'utilisateur lié à l'annonce
  const contactDoc = await db.collection("contacts").findOne({
    userId: doc.userId,
  });

  // 4) Mapper le document Mongo vers ton type `Annonce`
  const formattedAnnonce: Annonce = {
    id: String(doc._id ?? doc.id),
  
    // ✅ bonnes clés, conformes à l'interface
    typeAnnonceId: doc.typeAnnonceId ?? "",
    typeAnnonceName: doc.type_annonce?.name ?? "",
    typeAnnonceNameAr: doc.type_annonce?.nameAr ?? "",
  
    categorieId: doc.categorieId ?? "",
    categorieName: doc.categorie?.name ?? "",
    categorieNameAr: doc.categorie?.nameAr ?? "",
  
    lieuId: doc.lieuId ?? "",
    lieuStr: doc.lieuStr ?? "",
    lieuStrAr: doc.lieuStrAr ?? "",
  
    userId: doc.userId ?? "",
    title: doc.title ?? "",
    description: doc.description ?? "",
  
    // number assuré
    price: doc.price != null ? Number(doc.price) : 0,
  
    // contact récupéré de la collection contacts
    contact: contactDoc?.contact ?? "Contact non trouvé",
  
    haveImage: !!doc.haveImage,
    firstImagePath: doc.firstImagePath ? String(doc.firstImagePath) : "",
  
    // si tu stockes des images liées
    images: Array.isArray(doc.annonceImages)
      ? doc.annonceImages.map((img: any) => ({
          id: String(img._id ?? img.id ?? ""),
          imagePath: String(img.imagePath ?? ""),
        }))
      : [],
  
    status: doc.status ?? "",
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
    createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
  };
  
  console.log("Annonce formatée:", formattedAnnonce);

  // 5) Rendu
  return (
    <div className="p-4 sm:p-6 md:p-9 overflow-hidden">
      <div className="md:ml-32 lg:ml-44">
        <BackButton />
      </div>

      <div>
        <AnnonceDetailCompo
          annonceId={String(formattedAnnonce.id)}
          annonce={formattedAnnonce}
          imageServiceUrl="https://picsum.photos"
        />
      </div>
    </div>
  );
}
