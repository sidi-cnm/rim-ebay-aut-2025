"use client";

import React, { useMemo, useState } from "react";
import AddAnnonceStep1 from "./AddAnnonceStep1";
import AddAnnonceStep2 from "./AddAnnonceStep2";
import AddAnnonceStep3 from "./AddAnnonceStep3";
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
    { key: 3, label: t("wizard.steps.place") },
  ];
  const visualSteps = isRTL ? [...steps].reverse() : steps;

  const handleCreated = (id: string) => {
    setAnnonceId(id);
    setStep(2);
  };

  return (
    <main
      className="min-h-screen bg-gray-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ------------ Stepper ------------ */}
      <div className="mx-auto max-w-screen-lg px-3 sm:px-4 pt-4 sm:pt-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-100">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              {t("wizard.title")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{t("wizard.subtitle")}</p>
          </div>

          <div className="p-3 sm:p-4">
            {/* Mobile: ligne scrollable + wrap si besoin */}
            <ol
              className={`flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar ${
                isRTL ? "flex-row-reverse" : ""
              }`}
              aria-label={t("wizard.title")}
            >
              {visualSteps.map((s, idx) => {
                const isCurrent = step === s.key;
                const isCompleted = step > s.key;
                const isLast = idx === visualSteps.length - 1;

                return (
                  <li
                    key={s.key}
                    className={`flex items-center shrink-0 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium
                        ${
                          isCurrent
                            ? "bg-blue-900 text-white"
                            : isCompleted
                            ? "bg-blue-700 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white/20 border border-white/30 text-[11px] sm:text-xs">
                        {s.key}
                      </span>
                      <span className={`${isRTL ? "text-right" : "text-left"}`}>{s.label}</span>
                    </div>

                    {/* connecteur — plus court sur mobile, caché en xs si wrap */}
                    {!isLast && (
                      <div
                        className="h-1 w-10 sm:w-20 md:w-40 bg-gray-200 mx-2 sm:mx-3 hidden xs:block"
                        aria-hidden="true"
                      >
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
      <div className="mx-auto w-full max-w-screen-lg px-3 sm:px-4 py-4">
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
            onFinish={() => setStep(3)}
          />
        )}

        {step === 3 && annonceId && (
          <AddAnnonceStep3
            lang={lang}
            annonceId={annonceId}
            lieuxApiBase={`/${lang}/p/api/tursor/lieux`}
            updateAnnonceEndpoint={`/${lang}/api/my/annonces/${annonceId}`}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </main>
  );
}
