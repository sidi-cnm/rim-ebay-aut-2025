"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "../../../locales/client";
import { Home, List as ListIcon, Plus, Menu, X, LogIn, LogOut, Heart, Info } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Importer Prism de manière dynamique, seulement côté client
const PrismBG = dynamic(() => import("../../../packages/ui/components/Prism"), {
  ssr: false,
});


/* ---------- Conserver chemin + query quand on change de langue ---------- */
function useLocaleSwitch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  return (nextLocale: "fr" | "ar") => {
    const segments = (pathname || "/").split("/").filter(Boolean);
    const rest = segments.slice(1);
    const qs = searchParams?.toString();
    const newPath = `/${[nextLocale, ...rest].join("/")}${qs ? `?${qs}` : ""}`;
    router.push(newPath);
  };
}

/* ---------- Lien nav ---------- */
const NavLink = ({
  href,
  active,
  children,
  className = "",
  onClick,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md transition duration-200 text-sm md:text-base ${
      active ? "bg-white text-black" : "hover:bg-blue-600"
    } ${className}`}
  >
    {children}
  </Link>
);

/* ---------- Sélecteur de langue (drapeaux) ---------- */
function LanguageSelectFlags({
  currentLocale = "fr",
  onChange,
  compact = false,
}: {
  currentLocale?: "fr" | "ar";
  onChange: (code: "fr" | "ar") => void;
  compact?: boolean;
}) {
  const btnBase =
    "relative inline-flex items-center justify-center rounded-full bg-white text-lg leading-none shadow ring-1 ring-gray-300 hover:ring-blue-400 hover:scale-105 transition";
  const size = compact ? "h-9 w-9" : "h-10 w-10";
  const inactive = "opacity-60 grayscale";
  const activeRing = "ring-2 ring-white outline outline-2 outline-blue-600 drop-shadow";

  const Flag = ({
    code,
    emoji,
    label,
  }: { code: "fr" | "ar"; emoji: string; label: string }) => {
    const active = currentLocale === code;
    return (
      <button
        type="button"
        title={label}
        aria-label={label}
        aria-pressed={active}
        aria-current={active ? "page" : undefined}
        onClick={() => onChange(code)}
        className={`${btnBase} ${size} ${active ? activeRing : inactive}`}
      >
        <span aria-hidden>{emoji}</span>
        {active && (
          <>
            <span
              aria-hidden
              className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 grid place-items-center ring-2 ring-white"
            >
              <svg viewBox="0 0 20 20" className="h-3 w-3 text-white" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </>
        )}
      </button>
    );
  };

  return (
    <div role="tablist" aria-label="Language selector" className={`flex items-center gap-2`}>
      <Flag code="ar" emoji="🇲🇷" label="العربية — موريتانيا" />
      <Flag code="fr" emoji="🇫🇷" label="Français — France" />
    </div>
  );
}

/* =======================================================================
   NAV connecté
======================================================================= */

/* ==================== NAV connecté (fix: 1 seul logout + logo aligné aux liens) ==================== */
/* ==================== NAV connecté ==================== */
export const NavAuthUI = ({ lang = "ar" }: { lang?: string }) => {
  const localeKey = (lang || "fr").split("-")[0] as "fr" | "ar";
  const isAr = localeKey === "ar";
  const t = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const switchLocale = useLocaleSwitch();

  const toggleDrawer = () => setIsDrawerOpen(v => !v);
  const closeDrawer = () => setIsDrawerOpen(false);
  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    const response = await fetch(`/${localeKey}/api/p/users/logout`, { method: "POST" });
    if (response.ok) {
      router.push(`/${localeKey}`);
      router.refresh();
    }
  };

  const sideClass = isAr
    ? "left-0 -translate-x-full data-[open=true]:translate-x-0"
    : "right-0 translate-x-full data-[open=true]:translate-x-0";

  return (
    <nav className="relative sticky top-0 z-40 w-full h-full bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow-lg">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 md:px-6">
        {/* ===== Ligne principale ===== */}



        <div className="absolute inset-0 -z-10 pointer-events-none opacity-70">
        <PrismBG
        />
      </div>
        <div
          className={`flex items-center justify-between py-8 gap-6`}
        >
          {/* Bloc gauche ou droit : logo + liens */}
          <div className={`flex items-center gap-6`}>
            
            {/* Logo */}
            <Link
              href={`/${localeKey}`}
              className="flex items-center gap-2 hover:opacity-80 transition shrink-0"
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/images/logeddeyar.png"
                  alt="Rim Ijar"
                  width={120}               // largeur augmentée
                  height={120}              // hauteur augmentée
                  className="h-24 w-auto object-contain"  // h-24 = 6rem = 96px
                  priority
                />
              </div>
            </Link>




            <div className="hidden lg:flex items-center gap-2">

            <NavLink href={`/${localeKey}/`} active={isActive(`/${localeKey}`)}>
                <Home />
                {t("nav.home")}
              </NavLink>


              <NavLink href={`/${localeKey}/my/list`} active={isActive(`/${localeKey}/my/list`)}>
                <ListIcon className="h-5 w-5" />
                {t("nav.myListings")}
              </NavLink>

              <NavLink href={`/${localeKey}/my/add`} active={isActive(`/${localeKey}/my/add`)}>
                <Plus className="h-5 w-5" />
                {t("nav.addListing")}
              </NavLink>

              <NavLink href={`/${localeKey}/my/favorite`} active={isActive(`/${localeKey}/my/favorite`)}>
                <Heart className="h-5 w-5" />
                {t("nav.favorites") ?? "Favoris"}
              </NavLink>

               {/* === Nouveau lien About us === */}
               <NavLink href={`/${localeKey}/about`} active={isActive(`/${localeKey}/about`)}>
               <Info />
                 {t("nav.about") ?? "About us"}
              </NavLink>
            </div>
          </div>

          {/* Bloc opposé : actions (logout + langue) */}
          <div className={`flex items-center gap-2 sm:gap-3 ${isAr ? "order-1" : "order-2"}`}>
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 hover:bg-purple-500/80 bg-white/10 px-3 py-2 rounded-md transition"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline">{t("nav.logout")}</span>
            </button>
            <LanguageSelectFlags currentLocale={localeKey} onChange={switchLocale} compact />
            {/* Burger visible uniquement en mobile */}
            <button
              onClick={toggleDrawer}
              className="inline-flex lg:hidden p-2 rounded-md hover:bg-white/10"
              aria-label="Menu"
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay + Drawer mobile */}
      <button
        aria-hidden={!isDrawerOpen}
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        data-open={isDrawerOpen}
        className={`fixed top-0 bottom-0 ${sideClass} z-50 w-80 max-w-[85vw] bg-gradient-to-b from-purple-800 to-blue-800 text-white p-4 pt-5 transition-transform lg:hidden`}
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between mb-4">
          <button onClick={closeDrawer} className="p-2 rounded-md hover:bg-white/10" aria-label="Fermer">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col space-y-2">

        <NavLink href={`/${localeKey}/`} active={isActive(`/${localeKey}`)}>
                <Home className="h-5 w-5" />
                {t("nav.home")}
        </NavLink>

          <NavLink href={`/${localeKey}/my/list`} active={isActive(`/${localeKey}/my/list`)} onClick={closeDrawer}>
            <ListIcon className="h-5 w-5" />
            {t("nav.myListings")}
          </NavLink>

          <NavLink href={`/${localeKey}/my/add`} active={isActive(`/${localeKey}/my/add`)} onClick={closeDrawer}>
            <Plus className="h-5 w-5" />
            {t("nav.addListing")}
          </NavLink>

          <NavLink href={`/${localeKey}/my/favorite`} active={isActive(`/${localeKey}/my/favorite`)} onClick={closeDrawer}>
            <Heart className="h-5 w-5" />
            {t("nav.favorites") ?? "Favoris"}
          </NavLink>

           {/* === About us mobile === */}
           <NavLink href={`/${localeKey}/about`} active={isActive(`/${localeKey}/about`)} onClick={closeDrawer}>
           <Info />
             {t("nav.about") ?? "About us"}
          </NavLink>

          <button
            onClick={() => {
              handleLogout();
              closeDrawer();
            }}
            className="mt-2 flex items-center gap-2 hover:bg-purple-500 px-3 py-2 rounded-md transition"
          >
            <LogOut className="h-5 w-5" />
            {t("nav.logout")}
          </button>

          <div className="pt-4">
            <LanguageSelectFlags
              currentLocale={localeKey}
              onChange={(code) => {
                switchLocale(code);
                closeDrawer();
              }}
            />
          </div>
        </div>
      </aside>
    </nav>
  );
};



/* =======================================================================
   NAV non connecté
======================================================================= */
/* =======================================================================
   NAV non connecté
======================================================================= */
export const NavNonAuthUI = ({ lang = "ar" }: { lang?: string }) => {
  const localeKey = (lang || "fr").split("-")[0] as "fr" | "ar";
  const isAr = localeKey === "ar";
  const t = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const switchLocale = useLocaleSwitch();

  const close = () => setIsOpen(false);
  const sideClass = isAr
    ? "left-0 -translate-x-full data-[open=true]:translate-x-0"
    : "right-0 translate-x-full data-[open=true]:translate-x-0";

  return (
    <nav className="relative sticky top-0 z-40 w-full bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow-lg">
      {/* ===== Fond animé Prism (full width) ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-70">
        <PrismBG />
      </div>

      <div dir={isAr ? "rtl" : "ltr"} className="mx-auto max-w-screen-2xl px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between py-3 gap-2">

          {/* === Groupe Logo === */}
          <Link
            href={`/${localeKey}`}
            className="text-xl sm:text-2xl font-bold hover:text-yellow-300 transition flex items-center gap-2"
          >
            <div>
              <Image
                src="/images/logeddeyar.png"
                alt="Rim Ijar"
                width={120}
                height={120}
                className="h-24 w-auto object-contain sm:h-20"
                priority
              />
            </div>
          </Link>

          {/* === Groupe Actions (menu + langue) === */}
          <div className="flex items-center gap-2">
            {/* Burger visible uniquement en mobile */}
            <button
              onClick={() => setIsOpen(v => !v)}
              className="inline-flex p-2 rounded-md hover:bg-white/10 sm:hidden"
              aria-label="Menu"
            >
              <Menu className="h-7 w-7" />
            </button>

            {/* Lien Connexion visible uniquement en desktop */}
            <Link
              id="connexion"
              data-cy="connexion"
              href={`/${localeKey}/p/users/connexion`}
              className="hidden sm:flex items-center gap-2 hover:bg-green-500 px-3 py-2 text-black bg-white rounded-lg transition"
            >
              <LogIn className="h-5 w-5" />
              <span className="hidden md:inline">{t("nav.login")}</span>
            </Link>

            

            {/* Sélecteur de langue */}
            <LanguageSelectFlags currentLocale={localeKey} onChange={switchLocale} compact />
          </div>
        </div>
      </div>

      {/* Overlay + Drawer mobile */}
      <button
        aria-hidden={!isOpen}
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity sm:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        data-open={isOpen}
        className={`fixed top-0 bottom-0 ${sideClass} z-50 w-80 max-w-[85vw] bg-gradient-to-b from-purple-800 to-blue-800 text-white p-4 pt-5 transition-transform sm:hidden`}
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between mb-4">
              <Image 
                  src="/images/logeddeyar.png"
                  alt="Rim Ijar"
                  width={120}               // largeur augmentée
                  height={120}              // hauteur augmentée
                  className="h-24 w-auto object-contain"  // h-24 = 6rem = 96px
                  priority
                />
          <button onClick={close} className="p-2 rounded-md hover:bg-white/10" aria-label="Fermer">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-3">

        <Link
            href={`/${localeKey}/about`}
            onClick={close}
            className="flex items-center gap-2 hover:bg-blue-600 px-3 py-2 rounded-md transition"
          >
             <Info />
             {t("nav.about") ?? "About us"}
        </Link>

          <Link
            id="connexion-mobile"
            href={`/${localeKey}/p/users/connexion`}
            onClick={close}
            className="flex items-center gap-2 justify-center hover:bg-green-500 px-3 py-2 text-black bg-white rounded-lg transition"
          >
            <LogIn className="h-5 w-5" />
            {t("nav.login")}
          </Link>

          <div className="pt-2">
            <LanguageSelectFlags
              currentLocale={localeKey}
              onChange={(code) => { switchLocale(code); close(); }}
            />
          </div>
        </div>
      </aside>
    </nav>
  );
};

