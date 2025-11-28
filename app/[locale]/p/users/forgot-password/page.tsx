/*
File: app/[locale]/p/users/forgot-password/page.tsx
Description: Page for users to request a password reset link.
*/

import ForgotPasswordForm from './ui';

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
