import MyAnnonceDetailsUI from "./ui";
import BackButton from "../../../../../packages/ui/components/Navigation";
import { getI18n } from "../../../../../locales/server";
import { getUserFromCookies } from "../../../../../utiles/getUserFomCookies";
import { getUserStatus } from "../../../../../lib/services/annoncesService";
import { getDb } from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

type PageParams = { locale: string; id: string };

export default async function AnnonceDetail({
  params,
}: {
  params: Promise<PageParams>;          // <-- Next 15: params est un Promise
}) {
  const { locale, id } = await params;  // <-- on "await" les params
  const t = await getI18n();

  const user = await getUserFromCookies();
  const userId = user?.id ?? "";
  console.log("User ID from cookies:", user);

  
  

  const db = await getDb();

  let userFromDB
  let isSamsar = false;

  if (user?.id) {
     const status = await getUserStatus(String(user.id));
     isSamsar = status.isSamsar;
     userFromDB = { samsar: isSamsar }; // Adapter pour correspondre à l'usage existant
  }

    console.log("User from DB:", userFromDB);
  let contact = "Contact non trouvé";
  if (userId) {
    const contactDoc = await db.collection("contacts").findOne({
      userId: ObjectId.isValid(userId) ? String(new ObjectId(userId)) : String(userId),
    });
    if (contactDoc?.contact) contact = String(contactDoc.contact);
  }

  const annonceDbId = id;

  const modeOptionsApi =
    process.env.NEXT_PUBLIC_OPTIONS_API_MODE === "tursor" ? "tursor" : "sqlite";
  const baseApiOptions = modeOptionsApi === "sqlite" ? "/fr/p/api/sqlite" : "/fr/p/api/tursor";
  const typeAnnoncesEndpoint = `${baseApiOptions}/options`;
  const categoriesEndpoint = `${baseApiOptions}/options`;
  const subCategoriesEndpoint = `${baseApiOptions}/options`;

  const getAnnonceUrl = `/api/my/annonces/${annonceDbId}`;
  const updateAnnonceEndpoint = `/api/my/annonces/${annonceDbId}`;

  return (
    <div className="p-4 sm:p-6 md:p-9 overflow-hidden">
      <div><BackButton /></div>

      <MyAnnonceDetailsUI
        lang={locale}
        userFromDB={isSamsar}
        i18nAnnonce={t("filter.Annonces")}
        i18nContact={t("footer.contact")}
        i18nPrix={t("filter.price")}
        i18nNotificationsCreating={t("notifications.creating")}
        i18nNotificationsErrorDelete={t("notifications.errordelete")}
        i18nNotificationsSuccessDelete={t("notifications.successdelete")}
        annonceId={annonceDbId}
        retiveUrldetailsAnnonce={getAnnonceUrl}
        typeAnnoncesEndpoint={typeAnnoncesEndpoint}
        categoriesEndpoint={categoriesEndpoint}
        subCategoriesEndpoint={subCategoriesEndpoint}
        updateAnnonceEndpoint={updateAnnonceEndpoint}
      />
    </div>
  );
}
