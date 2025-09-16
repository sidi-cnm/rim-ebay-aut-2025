// app/[locale]/ui/MainChoiceUI.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  lang: string;
  currentChoice?: "location" | "vente" | "tous";
};

export default function MainChoiceUI({ lang, currentChoice }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (choice: "location" | "vente" | "tous") => {
    const params = new URLSearchParams(searchParams.toString());

    if (choice === "tous") {
      params.delete("mainChoice"); // on enlève le filtre
    } else {
      params.set("mainChoice", choice);
    }

    router.push(`/${lang}?${params.toString()}`);
  };

  return (
    <div className="flex gap-3 mb-6 justify-center">
      <button
        onClick={() => handleClick("tous")}
        className={`px-4 py-2 rounded-lg font-bold ${
          !currentChoice || currentChoice === "tous"
            ? "bg-yellow-400 text-black"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Tous
      </button>

      <button
        onClick={() => handleClick("location")}
        className={`px-4 py-2 rounded-lg font-bold ${
          currentChoice === "location"
            ? "bg-yellow-400 text-black"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Location
      </button>

      <button
        onClick={() => handleClick("vente")}
        className={`px-4 py-2 rounded-lg font-bold ${
          currentChoice === "vente"
            ? "bg-yellow-400 text-black"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Vente
      </button>
    </div>
  );
}
