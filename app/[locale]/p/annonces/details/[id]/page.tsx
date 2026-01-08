// app/[locale]/p/annonces/details/[id]/page.tsx
import BackButton from "../../../../../../packages/ui/components/Navigation";
import AnnonceDetailCompo from "../../../../../../packages/ui/components/All_AnnonceDetaille/AnnonceDetailUI";
import { Annonce } from "../../../../../../packages/mytypes/types";
import { getDb } from "../../../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { Metadata } from "next";
import AnnonceDetailUI from "../[id]/ui";

type PageParams = { id: string; locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { id } = await params;

  const db = await getDb();
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id as any };
  const doc = await db.collection("annonces").findOne(query);

  if (!doc) {
    return {
      title: "Annonce non trouvée | Rim EBay",
      description: "L'annonce demandée n'existe pas. Découvrez d'autres annonces sur notre plateforme.",
      keywords: ["annonce", "non trouvée", "erreur"],
      openGraph: {
        title: "Annonce non trouvée",
        description: "L'annonce demandée n'existe pas.",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Annonce non trouvée",
        description: "L'annonce demandée n'existe pas.",
      },
    };
  }

  const title = doc.title || "Détails de l'annonce";
  const description = doc.description ? doc.description.substring(0, 160) : "Consultez les détails de cette annonce.";
  const keywords = [doc.categorie?.name, doc.lieuStr, "annonce", "vente", "achat"].filter(Boolean);

  const metadata: Metadata = {
    title: `${title} | Eddeyar`,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
      images: doc.firstImagePath ? [{ url: doc.firstImagePath, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: doc.firstImagePath ? [doc.firstImagePath] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  return metadata;
}

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
    moughataaId: doc.moughataaId ?? "",
    moughataaStr: doc.moughataaStr ?? "",
    moughataaStrAr: doc.moughataaStrAr ?? "",
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
      {/* <AnnonceDetailCompo
        lang={locale || "fr"}
        annonceId={String(formattedAnnonce.id)}
        annonce={formattedAnnonce}
      /> */}
      <AnnonceDetailUI
        lang={locale || "fr"}
        annonceId={String(formattedAnnonce.id)}
        annonce={formattedAnnonce}
      />
    </div>
  );
}
