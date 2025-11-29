// app/[locale]/p/users/reset-password/page.tsx
import ResetPasswordUI from './ui';
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Réinitialiser le mot de passe | Rim EBay",
    description: "Entrez un nouveau mot de passe sécurisé pour votre compte.",
    keywords: ["réinitialiser mot de passe", "reset password", "nouveau mot de passe", "Rim EBay"],
    openGraph: {
      title: "Réinitialiser le mot de passe",
      description: "Entrez un nouveau mot de passe sécurisé.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Réinitialiser le mot de passe",
      description: "Entrez un nouveau mot de passe sécurisé.",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ResetPasswordPage({ params, searchParams }: any) {
  // Récupérer le token depuis searchParams de façon sûre
  const rawToken = searchParams?.token;
  const token = Array.isArray(rawToken) ? rawToken[0] : (rawToken ?? '');

  const locale = params?.locale ?? 'fr';

  return <ResetPasswordUI token={token} locale={locale} />;
}
