"use client";

import { usePathname } from "next/navigation";
import { NavAuthUI } from "./ui";
import { NavNonAuthUI } from "./ui";

export default function ConditionalNav({
  lang = "ar",
  isAuthenticated,
}: {
  lang?: string;
  isAuthenticated: boolean;
}) {
  const pathname = usePathname();

  // Vérifiez si on est dans l'espace admin
  const isAdmin = pathname.startsWith(`/${lang}/admin`);

  if (isAdmin) return null;

  return (
    <>
      {isAuthenticated ? (
        <NavAuthUI lang={lang} />
      ) : (
        <NavNonAuthUI lang={lang} />
      )}
    </>
  );
}
