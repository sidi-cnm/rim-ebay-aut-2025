"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Plus, Heart, Info, LogIn, User } from "lucide-react";
import { useI18n } from "../../../locales/client";

interface BottomNavProps {
  lang: string;
  isAuthenticated: boolean;
}

export default function BottomNav({ lang, isAuthenticated }: BottomNavProps) {
  const t = useI18n();
  const pathname = usePathname();
  const localeKey = (lang || "fr").split("-")[0] as "fr" | "ar";

  const isActive = (path: string) => pathname === path;

 // Base styling for items
  const itemClass = (active: boolean) =>
    `relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
      active ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
    }`;

  if (isAuthenticated) {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] h-[4.5rem] bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] pb-safe">
        <div className="grid grid-cols-5 h-full max-w-lg mx-auto items-center">
          <Link href={`/${localeKey}`} className={itemClass(isActive(`/${localeKey}`))}>
             <Home className={`w-6 h-6 ${isActive(`/${localeKey}`) ? "fill-current" : ""}`} strokeWidth={isActive(`/${localeKey}`) ? 2.5 : 2} />
             <span className="text-[10px] font-medium">{t("nav.home")}</span>
          </Link>

          <Link href={`/${localeKey}/my/list`} className={itemClass(isActive(`/${localeKey}/my/list`))}>
            <List className={`w-6 h-6 ${isActive(`/${localeKey}/my/list`) ? "fill-current" : ""}`} strokeWidth={isActive(`/${localeKey}/my/list`) ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t("nav.myListings")}</span>
          </Link>

          <div className="relative -top-6 flex justify-center pointer-events-none">
            <Link
              href={`/${localeKey}/my/add`}
              className="pointer-events-auto flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full text-white shadow-xl shadow-primary-500/30 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-white"
            >
              <Plus className="w-8 h-8" strokeWidth={2.5} />
            </Link>
          </div>

          <Link href={`/${localeKey}/my/favorite`} className={itemClass(isActive(`/${localeKey}/my/favorite`))}>
            <Heart className={`w-6 h-6 ${isActive(`/${localeKey}/my/favorite`) ? "fill-current" : ""}`} strokeWidth={isActive(`/${localeKey}/my/favorite`) ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t("nav.favorites") ?? "Favoris"}</span>
          </Link>

           <Link href={`/${localeKey}/about`} className={itemClass(isActive(`/${localeKey}/about`))}>
            <Info className={`w-6 h-6 ${isActive(`/${localeKey}/about`) ? "fill-current" : ""}`} strokeWidth={isActive(`/${localeKey}/about`) ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t("nav.about") ?? "About"}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Guest Navigation
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] h-[4.5rem] bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] pb-safe">
      <div className="grid grid-cols-4 h-full max-w-lg mx-auto px-2 items-center">
        <Link href={`/${localeKey}`} className={itemClass(isActive(`/${localeKey}`))}>
          <Home className={`w-6 h-6 ${isActive(`/${localeKey}`) ? "fill-current" : ""}`} strokeWidth={isActive(`/${localeKey}`) ? 2.5 : 2} />
          <span className="text-[10px] font-medium">{t("nav.home")}</span>
        </Link>

        <Link href={`/${localeKey}/about`} className={itemClass(isActive(`/${localeKey}/about`))}>
          <Info className={`w-6 h-6 ${isActive(`/${localeKey}/about`) ? "fill-current" : ""}`} strokeWidth={isActive(`/${localeKey}/about`) ? 2.5 : 2} />
          <span className="text-[10px] font-medium">{t("nav.about") ?? "About"}</span>
        </Link>

        <Link href={`/${localeKey}/p/users/connexion`} className={itemClass(isActive(`/${localeKey}/p/users/connexion`))}>
          <LogIn className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t("nav.login")}</span>
        </Link>

        <Link
          href={`/${localeKey}/p/users/register`}
           className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive(`/${localeKey}/p/users/register`) ? "text-primary-600" : "text-gray-500"
           }`}
        >
          <div className="bg-primary-50 p-2 rounded-full active:bg-primary-100 transition-colors">
             <User className="w-5 h-5 text-primary-600" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-bold text-primary-600">{t("nav.signup")}</span>
        </Link>
      </div>
    </div>
  );
}
