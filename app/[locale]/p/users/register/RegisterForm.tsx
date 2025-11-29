"use client"; 
import { useI18n } from "../../../../../locales/client"; 
import RegisterFormNumber from "./RegisterFormPhone";

export default function RegisterForm({ lang = "ar", urlboot }: { lang?: string; urlboot: string }) {
  const t = useI18n(); 

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {t("register.title")}
        </h1>
          <RegisterFormNumber lang={lang} urlboot={urlboot} />
      </div>
    </main>
  );
}
