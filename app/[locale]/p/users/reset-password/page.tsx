// app/[locale]/p/users/reset-password/page.tsx
// Server component — ne contient pas de 'use client' et n'utilise pas de hooks client

import ResetPasswordUI from './ui';

interface PageProps {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ResetPasswordPage({ params, searchParams }: PageProps) {
  // Récupère le token depuis searchParams (Next.js fournit searchParams aux server components)
  const tokenParam = Array.isArray(searchParams?.token) ? searchParams?.token[0] : searchParams?.token;
  const token = tokenParam ?? '';
  const locale = params?.locale ?? 'fr';

  // On passe token et locale au composant client
  return <ResetPasswordUI token={token} locale={locale} />;
}
