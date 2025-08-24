// app/[locale]/my/add/AddAnnonceWizard.tsx
"use client";

import React, { useMemo, useState } from "react";
import AddAnnonceStep1 from "./AddAnnonceStep1";
import AddAnnonceStep2 from "./AddAnnonceStep2";
import { useRouter } from "next/navigation";          // 👈 import

type Props = {
  lang?: string;
  relavieUrlOptionsModel: string;
  relavieUrlAnnonce: string;
};

export default function AddAnnonceWizard({
  lang = "ar",
  relavieUrlOptionsModel,
  relavieUrlAnnonce,
}: Props) {
  const router = useRouter();  
  const [step, setStep] = useState<1 | 2>(1);
  const [annonceId, setAnnonceId] = useState<string | null>(null);

  const isRTL = useMemo(() => lang?.startsWith("ar"), [lang]);

  const t = {
    title: isRTL ? "خطوات تأكيد ونشر الإعلان" : "Étapes de validation de l’annonce",
    subtitle: isRTL
      ? "اتبع الخطوات التالية لإكمال إعلانك ونشره."
      : "Suivez ces étapes pour compléter et publier votre annonce.",
    steps: [
      { key: 1, label: isRTL ? "المعلومات" : "Détails" },
      { key: 2, label: isRTL ? "الصور" : "Photos" },
    ],
  };

  // 🚀 Astuce : on inverse l'ordre visuel en RTL
  // This is no longer strictly necessary because flex-row-reverse handles the visual order.
  // However, it can be kept as a safeguard or for other logic that might depend on it.
  const visualSteps = isRTL ? [...t.steps].reverse() : t.steps;

  const handleCreated = (id: string) => {
    setAnnonceId(id);
    setStep(2);
  };

  const handleFinish = (_payload?: { firstImagePath?: string; images?: { url: string; isMain: boolean }[] }) => {
    router.push(`/${lang}/my/list`);
  };

  return (
    <main className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      {/* ------------ Carte Stepper ------------ */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="px-4 py-4 border-b border-gray-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {t.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
          </div>

          {/* Barre de progression */}

          {/* Barre de progression */}
          <div className="p-4 flex justify-center">
            <ol
              className={`inline-flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
              aria-label={t.title}
            >
              {visualSteps.map((s, idx) => {
  const isCurrent = step === s.key;
  const isCompleted = step > s.key;
  const isLast = idx === visualSteps.length - 1;

  return (
    <li key={s.key} className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
      {/* pastille + label */}
      <div
        className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium
          ${isCurrent ? "bg-blue-900 text-white" 
            : isCompleted ? "bg-blue-700 text-white" 
            : "bg-gray-200 text-gray-700"}`}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 border border-white/30">
          {s.key}
        </span>
        <span className={`${isRTL ? "text-right" : "text-left"}`}>{s.label}</span>
      </div>

      {/* connecteur */}
      {!isLast && (
        <div className="h-1 w-20 md:w-40 bg-gray-200 mx-2" aria-hidden="true">
          <div
            className={`h-1 transition-all ${
              isCompleted ? "bg-blue-900 w-full" : "w-0"
            }`}
          />
        </div>
      )}
    </li>
  );
})}
            </ol>
          </div>

          
        </div>
      </div>

      {/* ------------ Contenu des étapes ------------ */}
      <div className="mx-auto max-w-5xl p-4">
        {step === 1 && (
          <AddAnnonceStep1
            lang={lang}
            relavieUrlOptionsModel={relavieUrlOptionsModel}
            relavieUrlAnnonce={relavieUrlAnnonce}
            onCreated={handleCreated}
          />
        )}

        {step === 2 && annonceId && (
          <AddAnnonceStep2
            lang={lang}
            annonceId={annonceId}
            relavieUrlAnnonce={relavieUrlAnnonce}
            onBack={() => setStep(1)}
            onFinish={handleFinish}
          />
        )}
      </div>
    </main>
  );
}