"use client";

import React, { useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "../../../locales/client";
import { Home, List as ListIcon, Plus, Menu, X, LogIn, LogOut, Heart, Info } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

const PrismBG = dynamic(() => import("../../../packages/ui/components/Prism"), {
  ssr: false,
});

import BottomNav from "./BottomNav";


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
  const whatsapp = localeKey == "ar" ? "واتساب" : "WhatsApp";

  return (
    <nav className="relative sticky top-0 z-40 w-full bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow-lg">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 md:px-6">
        {/* ===== Ligne principale ===== */}



        <div className="absolute inset-0 -z-10 pointer-events-none opacity-70">
        <PrismBG
        />
      </div>
        <div
          className={`hidden lg:flex items-center justify-between py-8 gap-6`}
        >
          {/* Bloc gauche ou droit : logo + liens */}
          <div className={`hidden lg:flex items-center gap-6`}>
            
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
            {/* <Link
              href="https://wa.me/22241862698"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition shadow-md"
            >
              <FaWhatsapp className="h-6 w-6" />
              {whatsapp}
          </Link>  */}

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
            <Link
              href="https://wa.me/22241862698"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition shadow-md"
            >
              <FaWhatsapp className="h-6 w-6" />
              {whatsapp}
            </Link>
            <LanguageSelectFlags currentLocale={localeKey} onChange={switchLocale} compact />
            
            {/* Desktop Logout */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 hover:bg-purple-500/80 bg-white/10 px-3 py-2 rounded-md transition"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline">{t("nav.logout")}</span>
            </button>
            
          </div>
        </div>

        {/* ==================== LOGIN MOBILE HEADER USERS ==================== */}
        <div className="flex lg:hidden items-center justify-between pb-3">
             <Link
              href={`/${localeKey}`}
              className="flex items-center gap-2 hover:opacity-80 transition shrink-0"
            >
                <Image
                  src="/images/logeddeyar.png"
                  alt="Rim Ijar"
                  width={90}
                  height={90}
                  className="h-16 w-auto object-contain"
                  priority
                />
            </Link>

            <div className="flex items-center gap-3">
                 <Link
                  href="https://wa.me/22241862698"
                  target="_blank"
                  className="flex items-center justify-center w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition"
                >
                  <FaWhatsapp className="h-5 w-5" />
                </Link>

                 <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-9 h-9 bg-red-500/10 text-red-100 hover:bg-red-500 hover:text-white rounded-full transition"
                  title={t("nav.logout")}
                >
                  <LogOut className="h-5 w-5" />
                </button>

                <LanguageSelectFlags currentLocale={localeKey} onChange={switchLocale} compact />
            </div>
        </div>
        {/* ==================== END MOBILE HEADER ==================== */}

      </div>

      <BottomNav lang={lang} isAuthenticated={true} />
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
  const switchLocale = useLocaleSwitch();

  const whatsapp = localeKey == "ar" ? "واتساب" : "WhatsApp";

  return (
    <nav className="relative sticky top-0 z-40 w-full bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow-lg">
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-70">
        <PrismBG />
      </div>

      {/* ==================== GUEST MOBILE HEADER ==================== */}
      <div dir={isAr ? "rtl" : "ltr"} className="lg:hidden mx-auto max-w-screen-2xl px-3 w-full">
         <div className="flex items-center justify-between py-3">
             <Link
              href={`/${localeKey}`}
              className="flex items-center gap-2 hover:opacity-80 transition shrink-0"
            >
                <Image
                  src="/images/logeddeyar.png"
                  alt="Rim Ijar"
                  width={90}
                  height={90}
                  className="h-16 w-auto object-contain"
                  priority
                />
            </Link>

            <div className="flex items-center gap-3">
                 <Link
                  href="https://wa.me/22241862698"
                  target="_blank"
                  className="flex items-center justify-center w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition"
                >
                  <FaWhatsapp className="h-5 w-5" />
                </Link>

                 <LanguageSelectFlags currentLocale={localeKey} onChange={switchLocale} compact />
            </div>
         </div>
      </div>

      {/* ==================== GUEST DESKTOP HEADER ==================== */}
      <div dir={isAr ? "rtl" : "ltr"} className="hidden lg:block mx-auto max-w-screen-2xl px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between py-3 gap-2">

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

          <div className="flex items-center gap-2">
            <Link
              href="https://wa.me/22241862698"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition shadow-md"
            >
              <FaWhatsapp className="h-6 w-6" />
              {whatsapp}
            </Link>

            <Link
              id="connexion"
              data-cy="connexion"
              href={`/${localeKey}/p/users/connexion`}
              className="hidden sm:flex items-center gap-2 hover:bg-green-500 px-3 py-2 text-black bg-white rounded-lg transition"
            >
              <LogIn className="h-5 w-5" />
              <span className="hidden md:inline">{t("nav.login")}</span>
            </Link>

            <Link
              id="register"
              data-cy="register"
              href={`/${localeKey}/p/users/register`}
              className="hidden sm:flex items-center gap-2 hover:bg-green-500 px-3 py-2 text-black bg-white rounded-lg transition"
            >
              <LogIn className="h-5 w-5" />
              <span className="hidden md:inline">{t("nav.signup")}</span>
            </Link>

            <LanguageSelectFlags currentLocale={localeKey} onChange={switchLocale} compact />
          </div>
        </div>
      </div>
      
      <BottomNav lang={lang} isAuthenticated={false} />
    </nav>
  );
};

