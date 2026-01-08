"use client";
import { useState } from "react";
import { useI18n } from "../../../../../locales/client";
import ConnexionFormEmail from "./ConnexionFormEmail";
import ConnexionFormPhone from "./ConnexionFormPhone";


export default function ConnexionForm({ lang = "ar" }) {
    const t = useI18n();
    const [registrationMethod, setRegistrationMethod] = useState<"email" | "phone">("phone");
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 w-full max-w-md space-y-8">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
          {t("connexion.title")}
        </h1>

        {/* connexion Method Toggle */}
        {/* <div className="mb-6">
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
              هاتف
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
              {t("connexion.emailLabel")}
            </button>
          </div>
        </div> */}

        {/* Conditionally render the appropriate form */}
        {/* {registrationMethod === "email" ? ( */}
          <ConnexionFormPhone lang={lang} />
        {/* ) : (
          <ConnexionFormPhone lang={lang} />
        )} */}
      </div>
    </main>
  );
}
