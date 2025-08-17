// app/[locale]/my/details/[id]/page.tsx
import MyAnnonceDetailsUI from "./ui";
import BackButton from "../../../../../packages/ui/components/Navigation";
import { getI18n } from "../../../../../locales/server";
import { getDb } from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { getUserFromCookies } from "../../../../../utiles/getUserFomCookies";

type PageParams = { locale: string; id: string };

export default async function AnnonceDetail({ params }: { params: PageParams }) {
  const t = await getI18n();

  // user (cookies)
  const user = await getUserFromCookies(); // { id, email, ... } ou null
  const userId = user?.id ?? "";

  const db = await getDb();

  // contact de l'utilisateur (optionnel)
  let contact = "Contact non trouvé";
  if (userId) {
    const contactDoc = await db.collection("contacts").findOne({
      userId: ObjectId.isValid(userId) ? String(new ObjectId(userId)) : String(userId),
    });
    if (contactDoc?.contact) contact = String(contactDoc.contact);
  }

  // L’API attend l’ID **de l’annonce** (== params.id), pas l’ID utilisateur !
  const annonceDbId = params.id;

  // Endpoints d’options (inchangé)
  const modeOptionsApi =
    process.env.NEXT_PUBLIC_OPTIONS_API_MODE === "tursor" ? "tursor" : "sqlite";
  const baseApiOptions = modeOptionsApi === "sqlite" ? "/fr/p/api/sqlite" : "/fr/p/api/tursor";
  const typeAnnoncesEndpoint = `${baseApiOptions}/options`;
  const categoriesEndpoint = `${baseApiOptions}/options`;
  const subCategoriesEndpoint = `${baseApiOptions}/options`;

  // URLs API (toujours préfixées par la locale et avec l’id de l’annonce)
  const getAnnonceUrl = `/${params.locale}/api/my/annonces/${annonceDbId}`;
  const updateAnnonceEndpoint = `/${params.locale}/api/my/annonces/${annonceDbId}`; // si tu as une route PUT séparée

  return (
    <div className="p-4 sm:p-6 md:p-9 overflow-hidden">
      <div><BackButton /></div>

      <MyAnnonceDetailsUI
        lang={params.locale}
        // Affichage
        i18nAnnonce={t("filter.Annonces")}
        i18nContact={t("footer.contact")}
        i18nPrix={t("filter.price")}
        i18nNotificationsCreating={t("notifications.creating")}
        i18nNotificationsErrorDelete={t("notifications.errordelete")}
        i18nNotificationsSuccessDelete={t("notifications.successdelete")}
        // IDs + endpoints
        annonceId={annonceDbId}               // <-- ID de l’annonce pour DELETE
        retiveUrldetailsAnnonce={getAnnonceUrl} // <-- URL GET de l’annonce (avec locale)
        typeAnnoncesEndpoint={typeAnnoncesEndpoint}
        categoriesEndpoint={categoriesEndpoint}
        subCategoriesEndpoint={subCategoriesEndpoint}
        updateAnnonceEndpoint={updateAnnonceEndpoint}
      />
    </div>
  );
}
