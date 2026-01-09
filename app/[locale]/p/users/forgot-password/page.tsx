import ForgotPasswordForm from './ui';
import { Metadata } from "next";
import { getI18n } from '../../../../../locales/server';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mot de passe oublié | Rim EBay",
    description: "Demandez un lien de réinitialisation de mot de passe pour récupérer l'accès à votre compte.",
    keywords: ["mot de passe oublié", "réinitialisation", "reset password", "Rim EBay"],
    openGraph: {
      title: "Mot de passe oublié",
      description: "Demandez un lien de réinitialisation de mot de passe.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Mot de passe oublié",
      description: "Demandez un lien de réinitialisation de mot de passe.",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ForgotPasswordPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale || "fr";
  const t = await getI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">{t('forgotPassword.title')}</h1>

        <ForgotPasswordForm locale={locale} />
      </div>
    </div>
  );
}

