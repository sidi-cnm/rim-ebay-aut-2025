// import AddAnnonceUI from "./AddAnnonceUI";
// import AddAnnonceWizard from "./AddAnnonceWizard";
// import { cookies } from "next/headers";
// const relavieUrlAnnonce = "/fr/api/my/annonces";
// let relavieUrlOptionsModel = "/fr/p/api/tursor/";
// if (process.env.NEXT_PUBLIC_OPTIONS_API_MODE === "sqlite") {
//   relavieUrlOptionsModel = "/fr/p/api/sqlite/";
// }

// export default async function AddAnnonce(props: {
//   params: Promise<{ locale: string }>;
// }) {
//   const params = await props.params;
//   const userid = (await cookies()).get("user");
//   const userIdConverted = String(userid?.value);
//   //? parseInt(userid.value) : 0;
//   console.log("userid : ", userIdConverted);
//   return (
//     <>
//       <AddAnnonceWizard
//         lang={params.locale}
//         relavieUrlOptionsModel={relavieUrlOptionsModel}
//         relavieUrlAnnonce={relavieUrlAnnonce}
//       />
//     </>
//   );
// }




// app/[locale]/my/add/page.tsx
import AddAnnonceWizard from "./AddAnnonceWizard";
import { getUserFromCookies } from "../../../../utiles/getUserFomCookies";
import { getDb } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";



// const relavieUrlAnnonce = "/fr/api/my/annonces";
// let relavieUrlOptionsModel = "/fr/p/api/tursor";
// if (process.env.NEXT_PUBLIC_OPTIONS_API_MODE === "sqlite") {
//   relavieUrlOptionsModel = "/fr/p/api/sqlite";
// }

export default async function AddAnnonce(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  console.log("Locale from params:", params);

  const relavieUrlAnnonce = `/${params.locale}/api/my/annonces`;
  let relavieUrlOptionsModel = `/${params.locale}/p/api/tursor`;
//   if (process.env.NEXT_PUBLIC_OPTIONS_API_MODE === "sqlite") {
//     relavieUrlOptionsModel = `/${params.locale}/p/api/sqlite`;
// }

  let isSamsar;

  const user = await getUserFromCookies();
  const db = await getDb();

  if(user){
    console.log("user from cookie:", user.id);
    const userIndb= await db.collection("users").findOne({_id: new ObjectId(user.id)});
    console.log("userIndb check:", userIndb);
    if(userIndb){
      console.log("userIndb:", userIndb);
      isSamsar = userIndb.samsar;
    }
  }



  return (
    <AddAnnonceWizard
      lang={params.locale}
      relavieUrlOptionsModel={relavieUrlOptionsModel}
      relavieUrlAnnonce={relavieUrlAnnonce}
      isSamsar={isSamsar}
    />
  );
}
