import RegisterForm from "./RegisterForm"; 
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Inscription | eddeyar.com",
    description: "Créez votre compte utilisateur pour publier des annonces et acheter/vendre sur notre plateforme.",
    keywords: ["inscription", "register", "compte", "utilisateur", "eddeyar"],
    openGraph: {
      title: "Inscription",
      description: "Créez votre compte utilisateur sur eddeyar",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Inscription",
      description: "Créez votre compte utilisateur sur eddeyar.com.",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function RegisterPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  console.log("local cote server");
  console.log("parmas test", params.locale);
  return <RegisterForm lang={params.locale} urlboot={`/${params.locale}/api/telegram`} />;
}
