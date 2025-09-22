"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import AddAnnonceStep1 from "./AddAnnonceStep1";
import AddAnnonceStep2 from "./AddAnnonceStep2";
import AddAnnonceStep3 from "./AddAnnonceStep3";
import { useI18n } from "../../../../locales/client";

type Position = "owner" | "broker" | "other";
type RentalPeriod = "daily" | "weekly" | "monthly";

type Props = {
  lang?: string;
  relavieUrlOptionsModel: string;
  relavieUrlAnnonce: string;   // endpoint POST final
  isSamsar?: boolean;          // utilisateur inscrit comme courtier ?
};

type Draft = {
  // step 1
  typeAnnonceId?: string;
  categorieId?: string;        // optionnel
  subcategorieId?: string;     // optionnel
  title?: string;
  description?: string;
  price?: number | null;
  classificationFr?: string;
  classificationAr?: string;
  isSamsar?: boolean;
  typeAnnonceName?: string;
  categorieName?: string;
  typeAnnonceNameAr?: string;
  categorieNameAr?: string;

  // sans commission
  position?: Position;
  directNegotiation?: boolean | null;
  rentalPeriod?: RentalPeriod | null;

  // step 2
  images?: File[];
  mainIndex?: number;

  // step 3
  lieuId?: string;        // wilaya
  moughataaId?: string;   // moughataa
};

export default function AddAnnonceWizard({
  lang = "ar",
  relavieUrlOptionsModel,
  relavieUrlAnnonce,
  isSamsar = false,
}: Props) {
  const t = useI18n();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const wizardRef = useRef<HTMLDivElement | null>(null);
  const isRTL = useMemo(() => lang?.startsWith("ar"), [lang]);

  const [draft, setDraft] = useState<Draft>({});

  const steps = [
    { key: 1, label: t("wizard.steps.details") },
    { key: 2, label: t("wizard.steps.photos") },
    { key: 3, label: t("wizard.steps.place") },
  ];
  const visualSteps = isRTL ? [...steps].reverse() : steps;

  useEffect(() => {
    wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // ---- callbacks de progression ----
  const onStep1Next = (payload: {
    typeAnnonceId: string;
    categorieId?: string;
    subcategorieId?: string;
    title: string;
    description: string;
    price: number | null;
    position: Position;
    directNegotiation?: boolean | null;
    rentalPeriod?: RentalPeriod | null;
    rentalPeriodAr?: string | null;
    typeAnnonceName?: string;
    categorieName?: string;
    typeAnnonceNameAr?: string;
    categorieNameAr?: string;
  }) => {
    setDraft((d) => ({ ...d, ...payload }));
    setStep(2);
  };

  const onStep2Next = (payload: { images: File[]; mainIndex: number }) => {
    setDraft((d) => ({ ...d, ...payload }));
    setStep(3);
  };

  const onStep2Back = () => setStep(1);
  const onStep3Back = () => setStep(2);

  console.log("🚀 Lang in Wizard:", lang);


  return (
    <main className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      {/* ------------ Stepper ------------ */}
      <div className="mx-auto max-w-5xl px-4 pt-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="px-4 py-4 border-b border-gray-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {t("wizard.title")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{t("wizard.subtitle")}</p>
          </div>

          <div className={["p-4 w-full", isRTL ? "md:flex md:justify-end" : "md:flex md:justify-center"].join(" ")}>
            <div className="w-full overflow-x-auto">
              <ol
                className={[
                  "flex items-center",
                  isRTL ? "flex-row-reverse justify-end pr-2" : "flex-row",
                  "gap-2 sm:gap-3 md:gap-5",
                  "whitespace-nowrap min-w-max mx-auto",
                ].join(" ")}
                aria-label={t("wizard.title")}
              >
                {visualSteps.map((s, idx) => {
                  const isCurrent = step === s.key;
                  const isCompleted = step > s.key;
                  const isLast = idx === visualSteps.length - 1;
                  return (
                    <li key={s.key} className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
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
                      {!isLast && (
                        <div
                          className={[
                            "h-[2px]",
                            isCompleted ? "bg-blue-900" : isCurrent ? "bg-blue-300" : "bg-gray-200",
                            isRTL ? "ml-2 sm:ml-3 md:ml-4" : "mr-2 sm:mr-3 md:mr-4",
                          ].join(" ")}
                          style={{ width: "2.5rem" }}
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

      {/* ------------ Contenu ------------ */}
      <div className="mx-auto w-full max-w-screen-lg px-3 sm:px-4 py-4" ref={wizardRef}>
        {step === 1 && (
          <AddAnnonceStep1
            lang={lang}
            relavieUrlOptionsModel={relavieUrlOptionsModel}
            isSamsar={isSamsar}
            onNext={onStep1Next}
            initial={{
              typeAnnonceId: draft.typeAnnonceId ?? "",
              categorieId: draft.categorieId ?? "",
              subcategorieId: draft.subcategorieId ?? "",
              description: draft.description ?? "",
              price: draft.price ?? undefined,

              position: draft.position,
              directNegotiation: draft.directNegotiation ?? null,
              isSamsar: draft.isSamsar,
              rentalPeriod: draft.rentalPeriod,
              rentalPeriodAr: draft.classificationAr ,
              typeAnnonceName: draft.typeAnnonceName,
              categorieName: draft.categorieName,
              typeAnnonceNameAr: draft.typeAnnonceNameAr,
              categorieNameAr: draft.categorieNameAr,
            }}
          />
        )}

        {step === 2 && (
          <AddAnnonceStep2
            lang={lang}
            onBack={onStep2Back}
            onNext={onStep2Next}
            initial={{ images: draft.images, mainIndex: draft.mainIndex ?? 0 }}
          />
        )}

        {step === 3 && (
          <AddAnnonceStep3
            lang={lang}
            lieuxApiBase={`/${lang}/p/api/tursor/lieux`}
            createAnnonceEndpoint={`${relavieUrlAnnonce}`}
            urlboot={`/${lang}/api/telegram`}
            onBack={onStep3Back}
            draft={draft}
          />
        )}
      </div>
    </main>
  );
}
