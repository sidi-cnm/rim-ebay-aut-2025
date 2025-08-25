// app/[locale]/my/add/AddAnnonceWizard.tsx
"use client";

import React, { useMemo, useState } from "react";
import AddAnnonceStep1 from "./AddAnnonceStep1";
import AddAnnonceStep2 from "./AddAnnonceStep2";
import AddAnnonceStep3 from "./AddAnnonceStep3"; // 👈 NEW
import { useI18n } from "../../../../locales/client";

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
  const t = useI18n();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [annonceId, setAnnonceId] = useState<string | null>(null);

  const isRTL = useMemo(() => lang?.startsWith("ar"), [lang]);

  const steps = [
    { key: 1, label: t("wizard.steps.details") },
    { key: 2, label: t("wizard.steps.photos") },
    { key: 3, label: t("wizard.steps.place") },   // 👈 NEW
  ];
  const visualSteps = isRTL ? [...steps].reverse() : steps;

  const handleCreated = (id: string) => {
    setAnnonceId(id);
    setStep(2);
  };

  return (
    <main className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      {/* Stepper */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="px-4 py-4 border-b border-gray-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {t("wizard.title")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{t("wizard.subtitle")}</p>
          </div>

          <div className="p-4 flex justify-center">
            <ol
              className={`inline-flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              {visualSteps.map((s, idx) => {
                const isCurrent = step === s.key;
                const isCompleted = step > s.key;
                const isLast = idx === visualSteps.length - 1;
                return (
                  <li key={s.key} className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
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

                    {!isLast && (
                      <div className="h-1 w-20 md:w-40 bg-gray-200 mx-2" aria-hidden="true">
                        <div className={`h-1 transition-all ${isCompleted ? "bg-blue-900 w-full" : "w-0"}`} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* Contenu */}
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
            onFinish={() => setStep(3)}   // 👈 après upload → étape 3 (lieu)
          />
        )}

        {step === 3 && annonceId && (
          <AddAnnonceStep3
            lang={lang}
            annonceId={annonceId}
            lieuxApiBase={`/${lang}/p/api/tursor/lieux`}
            updateAnnonceEndpoint={`/${lang}/api/my/annonces/${annonceId}`}
            onBack={() => setStep(2)}
            onFinish={() => { /* optionnel */ }}
          />
        )}
      </div>
    </main>
  );
}
