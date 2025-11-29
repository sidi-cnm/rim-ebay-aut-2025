import ConnexionForm from "./ConnexionForm";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Connexion | eddeyar.com",
    description: "Connectez-vous à votre compte pour accéder à vos annonces et gérer vos achats/ventes.",
    keywords: ["connexion", "login", "compte", "authentification", "Rim EBay"],
    openGraph: {
      title: "Connexion",
      description: "Connectez-vous à votre compte Rim EBay.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Connexion",
      description: "Connectez-vous à votre compte Rim EBay.",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ConnexionPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  console.log("local cote server");
  console.log("sidi ::", params);
  return <ConnexionForm lang={params.locale} />;
}
