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
    `flex flex-col items-center justify-center w-full h-full space-y-1 ${
      active ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"
    }`;

  if (isAuthenticated) {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] pb-safe">
        <div className="grid grid-cols-5 h-full max-w-lg mx-auto">
          <Link href={`/${localeKey}`} className={itemClass(isActive(`/${localeKey}`))}>
            <Home className="w-6 h-6" />
            <span className="text-[10px]">{t("nav.home")}</span>
          </Link>

          <Link href={`/${localeKey}/my/list`} className={itemClass(isActive(`/${localeKey}/my/list`))}>
            <List className="w-6 h-6" />
            <span className="text-[10px]">{t("nav.myListings")}</span>
          </Link>

          <div className="relative -top-5">
            <Link
              href={`/${localeKey}/my/add`}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition transform active:scale-95 border-4 border-white"
            >
              <Plus className="w-7 h-7" />
            </Link>
          </div>

          <Link href={`/${localeKey}/my/favorite`} className={itemClass(isActive(`/${localeKey}/my/favorite`))}>
            <Heart className="w-6 h-6" />
            <span className="text-[10px]">{t("nav.favorites") ?? "Favoris"}</span>
          </Link>

          <Link href={`/${localeKey}/about`} className={itemClass(isActive(`/${localeKey}/about`))}>
            <Info className="w-6 h-6" />
            <span className="text-[10px]">{t("nav.about") ?? "About"}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Guest Navigation
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] pb-safe">
      <div className="grid grid-cols-4 h-full max-w-lg mx-auto px-2">
        <Link href={`/${localeKey}`} className={itemClass(isActive(`/${localeKey}`))}>
          <Home className="w-6 h-6" />
          <span className="text-[10px]">{t("nav.home")}</span>
        </Link>

        <Link href={`/${localeKey}/about`} className={itemClass(isActive(`/${localeKey}/about`))}>
          <Info className="w-6 h-6" />
          <span className="text-[10px]">{t("nav.about") ?? "About"}</span>
        </Link>

        <Link href={`/${localeKey}/p/users/connexion`} className={itemClass(isActive(`/${localeKey}/p/users/connexion`))}>
          <LogIn className="w-6 h-6" />
          <span className="text-[10px]">{t("nav.login")}</span>
        </Link>

        <Link
          href={`/${localeKey}/p/users/register`}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-blue-600 font-medium"
        >
          <div className="bg-blue-100 p-1.5 rounded-full">
             <User className="w-5 h-5" />
          </div>
          <span className="text-[10px]">{t("nav.signup")}</span>
        </Link>
      </div>
    </div>
  );
}
