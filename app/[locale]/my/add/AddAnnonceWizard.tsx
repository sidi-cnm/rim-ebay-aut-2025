"use client";

import React, { useRef, useEffect ,useMemo, useState } from "react";
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
  const wizardRef = useRef<HTMLDivElement | null>(null);

  const isRTL = useMemo(() => lang?.startsWith("ar"), [lang]);

  const steps = [
    { key: 1, label: t("wizard.steps.details") },
    { key: 2, label: t("wizard.steps.photos") },
    { key: 3, label: t("wizard.steps.place") },
  ];
  const visualSteps = isRTL ? [...steps].reverse() : steps;

  useEffect(() => {
    if (wizardRef.current) {
      wizardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [step])


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
      <div className="mx-auto max-w-5xl px-4 pt-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="px-4 py-4 border-b border-gray-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {t("wizard.title")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{t("wizard.subtitle")}</p>
          </div>

          {/* zone scrollable en mobile pour éviter tout débordement */}
          <div
            className={[
              "p-4 w-full",
              // en mobile: centré visuellement ; en desktop: à droite pour RTL, centré pour LTR
              isRTL ? "md:flex md:justify-end" : "md:flex md:justify-center",
            ].join(" ")}
          >
            <div className="w-full overflow-x-auto">
              <ol
                className={[
                  "flex items-center",
                  isRTL ? "flex-row-reverse justify-end pr-2" : "flex-row",
                  // petits espaces en mobile, plus grands ensuite
                  "gap-2 sm:gap-3 md:gap-5",
                  // empêche la casse sur 2 lignes et permet le scroll si nécessaire
                  "whitespace-nowrap min-w-max mx-auto",
                ].join(" ")}
                aria-label={t("wizard.title")}
              >
                {visualSteps.map((s, idx) => {
                  const isCurrent = step === s.key;
                  const isCompleted = step > s.key;
                  const isLast = idx === visualSteps.length - 1;

                  return (
                    <li
                      key={s.key}
                      className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      {/* pastille + label */}
                      <div
                        className={[
                          "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium",
                          isCurrent
                            ? "bg-blue-900 text-white"
                            : isCompleted
                            ? "bg-blue-700 text-white"
                            : "bg-gray-200 text-gray-700",
                        ].join(" ")}
                      >
                         
                        <span className={isRTL ? "text-right" : "text-left"}>{s.label}</span>
                      </div>

                      {/* connecteur : court en mobile, long en md+ */}
                     

                      {!isLast && (
                        <div
                          className={[
                            "h-[2px]",
                            // couleur de fond selon l'état
                            isCompleted
                              ? "bg-blue-900"
                              : isCurrent
                              ? "bg-blue-300"
                              : "bg-gray-200",
                            isRTL ? "ml-2 sm:ml-3 md:ml-4" : "mr-2 sm:mr-3 md:mr-4",
                          ].join(" ")}
                          style={{ width: "2.5rem" }} // court en mobile
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
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
