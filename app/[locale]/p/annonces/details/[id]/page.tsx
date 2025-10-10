// app/[locale]/p/annonces/details/[id]/page.tsx
import BackButton from "../../../../../../packages/ui/components/Navigation";
import AnnonceDetailCompo from "../../../../../../packages/ui/components/All_AnnonceDetaille/AnnonceDetailUI";
import { Annonce } from "../../../../../../packages/mytypes/types";
import { getDb } from "../../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

type PageParams = { id: string; locale: string };

export default async function AnnonceDetail({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { id, locale } = await params;

  const db = await getDb();
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id as any };
  const doc = await db.collection("annonces").findOne(query);

  if (!doc) {
    return <h1 className="text-2xl font-bold text-center mt-8">Annonce non trouvée</h1>;
  }

  const contactDoc = await db.collection("contacts").findOne({ userId: doc.userId });

  const formattedAnnonce: Annonce = {
    id: String(doc._id ?? doc.id),
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
    price: doc.price != null ? Number(doc.price) : 0,
    contact: doc?.contact ?? "",
    haveImage: !!doc.haveImage,
    firstImagePath: doc.firstImagePath ? String(doc.firstImagePath) : "",
    // on laisse images vide : le client va appeler /fr/api/images/:id pour les charger toutes
    images: [],
    status: doc.status ?? "",
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
    createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
  };

  return (
    <div className="p-4 sm:p-6 md:p-9 overflow-hidden">
      <div className="md:ml-32 lg:ml-44">
        <BackButton />
      </div>
      <AnnonceDetailCompo
        lang={locale || "fr"}
        annonceId={String(formattedAnnonce.id)}
        annonce={formattedAnnonce}
      />
    </div>
  );
}
