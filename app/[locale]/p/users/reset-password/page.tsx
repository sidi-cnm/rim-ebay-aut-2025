import ResetPasswordUI from './ui';
import { Metadata } from "next";
import { getI18n } from '../../../../../locales/server';

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

export default async function ResetPasswordPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale ?? 'fr';
  const t = await getI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">{t('resetPassword.title')}</h1>
        <ResetPasswordUI locale={locale} />
      </div>
    </div>
  );
}

