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
import { cookies } from "next/headers";

const relavieUrlAnnonce = "/fr/api/my/annonces";
let relavieUrlOptionsModel = "/fr/p/api/tursor";
if (process.env.NEXT_PUBLIC_OPTIONS_API_MODE === "sqlite") {
  relavieUrlOptionsModel = "/fr/p/api/sqlite";
}

export default async function AddAnnonce(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  return (
    <AddAnnonceWizard
      lang={params.locale}
      relavieUrlOptionsModel={relavieUrlOptionsModel}
      relavieUrlAnnonce={relavieUrlAnnonce}
    />
  );
}
