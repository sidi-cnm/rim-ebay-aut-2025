"use client";
import { useState } from "react";
import { useI18n } from "../../../../../locales/client";
import RegisterFormEmail from "./RegisterFormEmail";
import RegisterFormNumber from "./RegisterFormPhone";

export default function RegisterForm({ lang = "ar", urlboot }: { lang?: string; urlboot: string }) {
  const t = useI18n();
  const [registrationMethod, setRegistrationMethod] = useState<"email" | "phone">("phone");

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {t("register.title")}
        </h1>

        {/* Registration Method Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            اختر طريقة التسجيل
          </label>
          <div className="flex gap-4">
          <button
              type="button"
              onClick={() => setRegistrationMethod("phone")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                registrationMethod === "phone"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t("register.Telephone")}
            </button>
            <button
              type="button"
              onClick={() => setRegistrationMethod("email")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                registrationMethod === "email"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t("register.emailLabel")}
            </button>
          </div>
        </div>

        {/* Conditionally render the appropriate form */}
        {registrationMethod === "email" ? (
          <RegisterFormEmail lang={lang} urlboot={urlboot} />
        ) : (
          <RegisterFormNumber lang={lang} urlboot={urlboot} />
        )}
      </div>
    </main>
  );
}
