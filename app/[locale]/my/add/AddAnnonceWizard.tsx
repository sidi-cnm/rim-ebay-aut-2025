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
  title?: string;              // user-provided or auto-generated
  userProvidedTitle?: string;  // original user input (to restore when going back)
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
  isPriceHidden?: boolean;
  privateDescription?: string;

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
    userProvidedTitle?: string;
    description: string;
    price: number | null;
    position: Position;
    directNegotiation?: boolean | null;
    rentalPeriod?: RentalPeriod | null;
    rentalPeriodAr?: string | null;
    isPriceHidden?: boolean;
    typeAnnonceName?: string;
    categorieName?: string;
    typeAnnonceNameAr?: string;
    categorieNameAr?: string;
    privateDescription?: string;
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

  // console.log("🚀 Lang in Wizard:", lang);


  return (
    <main className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      {/* ------------ Stepper ------------ */}
      <div className="mx-auto max-w-4xl px-4 pt-4 sm:pt-8" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
              {t("wizard.title")}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-1">{t("wizard.subtitle")}</p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="w-full">
              <ol
                className="flex items-center w-full justify-between"
                aria-label={t("wizard.title")}
              >
                {steps.map((s, idx) => {
                  const isCurrent = step === s.key;
                  const isCompleted = step > s.key;
                  const isLast = idx === steps.length - 1;
                  
                  return (
                    <li key={s.key} className={`flex-1 flex items-center min-w-0 ${isLast ? "flex-none" : ""}`}>
                      <div className="flex flex-col items-center gap-2 relative z-10 group cursor-default">
                          <div
                            className={[
                              "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ring-4 ring-white",
                              isCurrent
                                ? "bg-primary-600 text-white shadow-lg shadow-primary-200 scale-110"
                                : isCompleted
                                ? "bg-green-500 text-white shadow-md shadow-green-100"
                                : "bg-gray-100 text-gray-400",
                            ].join(" ")}
                          >
                            {isCompleted ? (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            ) : (
                                <span>{s.key}</span>
                            )}
                          </div>
                          <span className={[
                              "text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap absolute -bottom-6 transition-colors duration-300",
                              isCurrent ? "text-primary-700" : isCompleted ? "text-green-600" : "text-gray-400"
                          ].join(" ")}>
                              {s.label}
                          </span>
                      </div>
                      
                      {!isLast && (
                        <div className="flex-1 h-1 mx-2 rounded-full bg-gray-100 relative overflow-hidden">
                             <div 
                                className={[
                                    "absolute top-0 bottom-0 transition-all duration-500 ease-out",
                                     isCompleted 
                                        ? "bg-green-500 w-full" 
                                        : isCurrent 
                                            ? (isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r") + " from-green-500 to-gray-100 w-1/2" 
                                            : "w-0"
                                ].join(" ")}
                                style={{ [isRTL ? 'right' : 'left']: 0 }}
                             />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
            {/* Spacer for labels */}
            <div className="h-5"></div>
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
              title: draft.userProvidedTitle ?? "",
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
              privateDescription: draft.privateDescription,
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
