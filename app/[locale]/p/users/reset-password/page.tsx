// app/[locale]/p/users/reset-password/page.tsx
import ResetPasswordUI from './ui';

export default function ResetPasswordPage({ params, searchParams }: any) {
  // Récupérer le token depuis searchParams de façon sûre
  const rawToken = searchParams?.token;
  const token = Array.isArray(rawToken) ? rawToken[0] : (rawToken ?? '');

  const locale = params?.locale ?? 'fr';

  return <ResetPasswordUI token={token} locale={locale} />;
}
