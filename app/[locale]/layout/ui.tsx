"use client";

import React, { useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "../../../locales/client";
import { Home, List as ListIcon, Plus, Menu, X, LogIn, LogOut, Heart, Info, ChevronDown, Check } from "lucide-react";
import Image from "next/image";

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
    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[15px] ${
      active ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
    } ${className}`}
  >
    {children}
  </Link>
);

/* ---------- Sélecteur de langue (drapeaux) ---------- */
/* ---------- Sélecteur de langue (dropdown) ---------- */
function LanguageSelectFlags({
  currentLocale = "fr",
  onChange,
  compact = false,
}: {
  currentLocale?: "fr" | "ar";
  onChange: (code: "fr" | "ar") => void;
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Mapping des langues
  const languages = [
    { code: "ar", label: "AR", emoji: "🇲🇷", title: "العربية — موريتانيا" },
    { code: "fr", label: "FR", emoji: "🇫🇷", title: "Français — France" },
  ] as const;

  const activeLang = languages.find((l) => l.code === currentLocale) || languages[0];

  const handleSelect = (code: "fr" | "ar") => {
    onChange(code);
    setIsOpen(false);
  };

  // MODE: DROPDOWN (Mobile / Compact)
  if (compact) {
    return (
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-700 font-medium text-sm shadow-sm`}
        >
          <span>{activeLang.label}</span>
          <span className="text-lg leading-none">{activeLang.emoji}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-30 cursor-default" onClick={() => setIsOpen(false)} />
            <div
              className={`absolute mt-2 w-40 z-40 rounded-xl bg-white text-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none p-1 ${
                currentLocale === "ar" ? "left-0 origin-top-left" : "right-0 origin-top-right"
              }`}
            >
              <div className="flex flex-col gap-1">
                {languages.map((lang) => {
                  const isActive = currentLocale === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{lang.label}</span>
                        <span className="text-xl leading-none">{lang.emoji}</span>
                      </div>
                      {isActive && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // MODE: FLAGS BUTTONS (Desktop / Standard)
  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => {
        const isActive = currentLocale === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            title={lang.title}
            onClick={() => onChange(lang.code)}
            className={`relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-white text-lg leading-none shadow-sm ring-1 ring-gray-200 transition hover:ring-gray-300 ${
               isActive ? "ring-2 ring-blue-500" : "opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
            }`}
          >
            <span aria-hidden>{lang.emoji}</span>
            {isActive && (
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-blue-500 grid place-items-center ring-2 ring-white">
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />
              </span>
            )}
          </button>
        );
      })}
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
    const response = await fetch(`/api/p/users/logout`, { method: "POST" });
    if (response.ok) {
      router.push(`/${localeKey}`);
      router.refresh();
    }
  };

  const whatsapp = localeKey == "ar" ? "واتساب" : "WhatsApp";

  return (
    <>
    <nav className="sticky top-0 z-50 w-full bg-[#2563eb] backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        {/* ===== Ligne principale ===== */}

        <div
          className={`hidden lg:flex items-center justify-between py-3 gap-6`}
        >
          {/* Bloc gauche ou droit : logo + liens */}
          <div className={`hidden lg:flex items-center gap-8`}>
            
            <Link
              href={`/${localeKey}`}
              className="flex items-center gap-2 hover:opacity-80 transition shrink-0"
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/images/logeddeyar.png"
                  alt="Rim Ijar"
                  width={140}
                  height={140}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-1">

            <NavLink href={`/${localeKey}/`} active={isActive(`/${localeKey}`)}>
                {t("nav.home")}
              </NavLink>


              <NavLink href={`/${localeKey}/my/list`} active={isActive(`/${localeKey}/my/list`)}>
                {t("nav.myListings")}
              </NavLink>

              <NavLink href={`/${localeKey}/my/add`} active={isActive(`/${localeKey}/my/add`)}>
                {t("nav.addListing")}
              </NavLink>

              <NavLink href={`/${localeKey}/my/favorite`} active={isActive(`/${localeKey}/my/favorite`)}>
                {t("nav.favorites") ?? "Favoris"}
              </NavLink>

               {/* === Nouveau lien About us === */}
               <NavLink href={`/${localeKey}/about`} active={isActive(`/${localeKey}/about`)}>
                 {t("nav.about") ?? "About us"}
              </NavLink>
            </div>
          </div>

          {/* Bloc opposé : actions (logout + langue) */}
          <div className={`flex items-center gap-4 ${isAr ? "order-1" : "order-2"}`}>
            <Link
              href="https://wa.me/22241862698"
              target="_blank"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
            >
              <FaWhatsapp className="h-5 w-5" />
              {whatsapp}
            </Link>
            
            <div className="h-6 w-px bg-gray-200"></div>

            <LanguageSelectFlags currentLocale={localeKey} onChange={switchLocale} compact />
            
            {/* Desktop Logout */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 hover:bg-white/10 text-white/70 hover:text-white px-3 py-2 rounded-xl transition-colors font-medium"
              title={t("nav.logout")}
            >
              <LogOut className="h-5 w-5" />
            </button>
            
          </div>
        </div>

        {/* ==================== LOGIN MOBILE HEADER USERS ==================== */}
        <div className="flex lg:hidden items-center justify-between py-3">
             <Link
              href={`/${localeKey}`}
              className="flex items-center gap-2 hover:opacity-80 transition shrink-0"
            >
                <Image
                  src="/images/logeddeyar.png"
                  alt="Rim Ijar"
                  width={120}
                  height={120}
                  className="h-9 w-auto object-contain"
                  priority
                />
            </Link>

            <div className="flex items-center gap-3">
                 <Link
                  href="https://wa.me/22241862698"
                  target="_blank"
                  className="flex items-center justify-center w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-md transition-colors"
                >
                  <FaWhatsapp className="h-5 w-5" />
                </Link>

                 <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-10 h-10 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors"
                  title={t("nav.logout")}
                >
                  <LogOut className="h-5 w-5" />
                </button>

                <LanguageSelectFlags currentLocale={localeKey} onChange={switchLocale} compact />
            </div>
        </div>
        {/* ==================== END MOBILE HEADER ==================== */}

      </div>
    </nav>
    <BottomNav lang={lang} isAuthenticated={true} />
    </>
  );
};



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
    <>
    <nav className="sticky top-0 z-50 w-full bg-[#2563eb] backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">

      {/* ==================== GUEST MOBILE HEADER ==================== */}
      <div dir={isAr ? "rtl" : "ltr"} className="lg:hidden mx-auto max-w-screen-2xl px-4 w-full">
         <div className="flex items-center justify-between py-3">
             <Link
              href={`/${localeKey}`}
              className="flex items-center gap-2 hover:opacity-80 transition shrink-0"
            >
                <Image
                  src="/images/logeddeyar.png"
                  alt="Rim Ijar"
                  width={120}
                  height={120}
                  className="h-9 w-auto object-contain"
                  priority
                />
            </Link>

            <div className="flex items-center gap-3">
                 <Link
                  href="https://wa.me/22241862698"
                  target="_blank"
                  className="flex items-center justify-center w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-md transition-colors"
                >
                  <FaWhatsapp className="h-5 w-5" />
                </Link>

                 <LanguageSelectFlags currentLocale={localeKey} onChange={switchLocale} compact />
            </div>
         </div>
      </div>

      {/* ==================== GUEST DESKTOP HEADER ==================== */}
      <div dir={isAr ? "rtl" : "ltr"} className="hidden lg:block mx-auto max-w-screen-2xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 gap-4">

          <Link
            href={`/${localeKey}`}
            className="flex items-center gap-2 hover:opacity-80 transition shrink-0"
          >
            <Image
              src="/images/logeddeyar.png"
              alt="Rim Ijar"
              width={140}
              height={140}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 mr-4 text-sm font-semibold text-white/70">
               <Link href={`/${localeKey}`} className="hover:text-white px-3 py-2 transition-colors">{t("nav.home")}</Link>
               <Link href={`/${localeKey}/about`} className="hover:text-white px-3 py-2 transition-colors">{t("nav.about") ?? "À propos"}</Link>
             </div>

            <Link
              href="https://wa.me/22241862698"
              target="_blank"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
            >
              <FaWhatsapp className="h-5 w-5" />
              {whatsapp}
            </Link>

            <div className="h-6 w-px bg-gray-200"></div>

            <Link
              id="connexion"
              data-cy="connexion"
              href={`/${localeKey}/p/users/connexion`}
              className="flex items-center gap-2 px-5 py-2.5 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all font-bold hover:shadow-sm"
            >
              <LogIn className="h-5 w-5" />
              <span>{t("nav.login")}</span>
            </Link>

            <Link
              id="register"
              data-cy="register"
              href={`/${localeKey}/p/users/register`}
              className="flex items-center gap-2 px-5 py-2.5 text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all font-bold shadow-lg shadow-primary-600/20 hover:-translate-y-0.5"
            >
              <span>{t("nav.signup")}</span>
            </Link>

            {/* Sélecteur de langue */}
            <div className="ml-2">
               <LanguageSelectFlags currentLocale={localeKey} onChange={switchLocale} compact />
            </div>
          </div>
        </div>
      </div>
      
    </nav>
    <BottomNav lang={lang} isAuthenticated={false} />
    </>
  );
};

