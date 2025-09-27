"use client";

import { Facebook } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { useI18n } from "../../../locales/client";

export default function AboutPage({ locale }: { locale: string }) {
  const localeKey = (locale || "fr").split("-")[0] as "fr" | "ar";
  const t = useI18n();
  const isAr = localeKey === "ar";

  // Contenu en fonction de la langue
  const content = {
    fr: {
      title: "À propos de nous",
      description: (
        <>
          <strong>eddeyar</strong> est une plateforme moderne spécialisée dans la{" "}
          <span className="font-semibold text-blue-700">vente et la location de maisons</span> 🏡
          ainsi que de <span className="font-semibold text-blue-700">voitures</span> 🚗 en
          Mauritanie.  
          Notre mission est de simplifier vos recherches en vous connectant rapidement aux
          meilleures offres près de chez vous. 🌍
        </>
      ),
      contact: "Contactez-nous",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
    },
    ar: {
      title: "معلومات عنا",
      description: (
        <>
          <strong>الديار</strong> هي منصة حديثة متخصصة في{" "}
          <span className="font-semibold text-blue-700">بيع وتأجير المنازل</span> 🏡
          وكذلك <span className="font-semibold text-blue-700">السيارات</span> 🚗 في موريتانيا.  
          مهمتنا هي تبسيط عملية البحث وربطك بسرعة بأفضل العروض بالقرب منك. 🌍
        </>
      ),
      contact: "اتصل بنا",
      whatsapp: "واتساب",
      facebook: "فيسبوك",
    },
  };

  const c = content[localeKey];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center" dir={isAr ? "rtl" : "ltr"}>
        {/* Titre */}
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6">{c.title}</h1>

        {/* Définition */}
        <p className="text-lg text-gray-700 leading-relaxed mb-10">{c.description}</p>

        {/* Section contact */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">{c.contact}</h2>

          <div className="flex flex-wrap justify-center gap-6">
            {/* WhatsApp */}
            <Link
              href="https://wa.me/22241862698"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition shadow-md"
            >
              <FaWhatsapp className="h-6 w-6" />
              {c.whatsapp}
            </Link>

            {/* Facebook */}
            <Link
              href="https://web.facebook.com/profile.php?id=61581382520719"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md"
            >
              <Facebook className="h-6 w-6" />
              {c.facebook}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
