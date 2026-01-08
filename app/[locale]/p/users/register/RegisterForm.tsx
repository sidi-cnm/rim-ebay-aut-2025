"use client"; 
import { useI18n } from "../../../../../locales/client"; 
import RegisterFormNumber from "./RegisterFormPhone";

export default function RegisterForm({ lang = "ar", urlboot }: { lang?: string; urlboot: string }) {
  const t = useI18n(); 

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 w-full max-w-md space-y-8">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
          {t("register.title")}
        </h1>
          <RegisterFormNumber lang={lang} urlboot={urlboot} />
      </div>
    </main>
  );
}
