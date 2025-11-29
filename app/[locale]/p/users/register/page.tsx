import RegisterForm from "./RegisterForm";
import RegisterFormNumber from "./RegisterFormPhone";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Inscription | Rim EBay",
    description: "Créez votre compte utilisateur pour publier des annonces et acheter/vendre sur notre plateforme.",
    keywords: ["inscription", "register", "compte", "utilisateur", "Rim EBay"],
    openGraph: {
      title: "Inscription",
      description: "Créez votre compte utilisateur sur Rim EBay.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Inscription",
      description: "Créez votre compte utilisateur sur Rim EBay.",
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
