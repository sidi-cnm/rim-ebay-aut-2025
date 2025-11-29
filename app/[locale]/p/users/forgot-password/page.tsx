/*
File: app/[locale]/p/users/forgot-password/page.tsx
Description: Page for users to request a password reset link.
*/

import ForgotPasswordForm from './ui';
import { Metadata } from "next";

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

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Mot de passe oublié</h1>

        {/* Client Component */}
        <ForgotPasswordForm />

        <p className="mt-6 text-center text-sm">
          <a href="/login" className="text-blue-600 hover:underline">
            Retour à la connexion
          </a>
        </p>
      </div>
    </div>
  );
}
