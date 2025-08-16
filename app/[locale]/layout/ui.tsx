"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaList,
  FaPlus,
  FaBars,
  FaSignInAlt,
  FaTimes,
} from "react-icons/fa";
import { useI18n } from "../../../locales/client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/** Hook: bascule la locale en conservant le chemin + les query params */
function useLocaleSwitch() {
  const pathname = usePathname();           // ex: /ar/my/list
  const searchParams = useSearchParams();   // ex: ?page=2
  const router = useRouter();

  return (nextLocale: "fr" | "ar") => {
    const segments = (pathname || "/").split("/").filter(Boolean); // ["ar","my","list"]
    const rest = segments.slice(1);                                 // ["my","list"]
    const qs = searchParams?.toString();
    const newPath = `/${[nextLocale, ...rest].join("/")}${qs ? `?${qs}` : ""}`;
    router.push(newPath);
  };
}

/** NAV quand l'utilisateur est connecté */
export const NavAuthUI = ({ lang = "ar" }: { lang?: string }) => {
  const localeKey = (lang || "fr").split("-")[0] as "fr" | "ar";
  const isAr = localeKey === "ar";
  const t = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const switchLocale = useLocaleSwitch();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    const response = await fetch(`/${localeKey}/api/p/users/logout`, {
      method: "POST",
    });
    if (response.ok) {
      // Retourne vers la home dans la langue courante
      router.push(`/${localeKey}`);
      router.refresh();
    }
  };

  return (
    <nav className="p-6 bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow-lg">
      <div className="flex justify-between items-center">
        {/* Home: conserve la locale */}
        <Link
          href={`/${localeKey}`}
          className="text-2xl font-bold hover:text-yellow-300 transition duration-300"
        >
          <FaHome className="inline-block mr-2" />
          {t("nav.rimIjar")}
        </Link>

        <button
          onClick={toggleDrawer}
          className="text-2xl lg:hidden focus:outline-none"
        >
          {isDrawerOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Drawer mobile */}
        <div
          className={`fixed top-0 right-0 h-full bg-gradient-to-r from-blue-800 to-purple-800 text-white p-6 shadow-lg transform ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 w-3/4 lg:hidden z-50`}
        >
          <button
            onClick={toggleDrawer}
            className="text-2xl mb-6 focus:outline-none"
          >
            <FaTimes />
          </button>

          <div className="flex flex-col space-y-6">
            <Link
              href={`/${localeKey}/my/list`}
              className={`flex items-center px-3 py-2 rounded transition duration-300 ${
                isActive(`/${localeKey}/my/list`)
                  ? "bg-white text-black"
                  : "hover:bg-blue-600"
              }`}
              onClick={toggleDrawer}
            >
              <FaList className="mr-2" />
              {t("nav.myListings")}
            </Link>

            <Link
              href={`/${localeKey}/my/add`}
              id="addannonce"
              className={`flex items-center px-3 py-2 rounded transition duration-300 ${
                isActive(`/${localeKey}/my/add`)
                  ? "bg-white text-black"
                  : "hover:bg-blue-600"
              }`}
              onClick={toggleDrawer}
            >
              <FaPlus className="mr-2" />
              {t("nav.addListing")}
            </Link>

            <button
              onClick={() => {
                handleLogout();
                toggleDrawer();
              }}
              className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              {t("nav.logout")}
            </button>

            {/* Switch langue - mobile (conserve chemin + query) */}
            {!isAr ? (
              <button
                onClick={() => {
                  switchLocale("ar");
                  toggleDrawer();
                }}
                className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
              >
                العربية
              </button>
            ) : (
              <button
                onClick={() => {
                  switchLocale("fr");
                  toggleDrawer();
                }}
                className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
              >
                français
              </button>
            )}
          </div>
        </div>

        {/* Liens desktop */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link
            href={`/${localeKey}/my/list`}
            className={`flex items-center px-3 py-2 rounded transition duration-300 ${
              isActive(`/${localeKey}/my/list`)
                ? "bg-white text-black"
                : "hover:bg-blue-600"
            }`}
          >
            <FaList className="mr-2" />
            {t("nav.myListings")}
          </Link>

          <Link
            href={`/${localeKey}/my/add`}
            id="addannonce"
            className={`flex items-center px-3 py-2 rounded transition duration-300 ${
              isActive(`/${localeKey}/my/add`)
                ? "bg-white text-black"
                : "hover:bg-blue-600"
            }`}
          >
            <FaPlus className="mr-2" />
            {t("nav.addListing")}
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
          >
            {t("nav.logout")}
          </button>

          {/* Switch langue - desktop (conserve chemin + query) */}
          {!isAr ? (
            <button
              onClick={() => switchLocale("ar")}
              className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              العربية
            </button>
          ) : (
            <button
              onClick={() => switchLocale("fr")}
              className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              français
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

/** NAV quand l'utilisateur n'est PAS connecté */
export const NavNonAuthUI = ({ lang = "ar" }: { lang?: string }) => {
  const localeKey = (lang || "fr").split("-")[0] as "fr" | "ar";
  const isAr = localeKey === "ar";
  const t = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const switchLocale = useLocaleSwitch();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full p-4 bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        {/* Home: conserve la locale */}
        <div>
          <Link
            href={`/${localeKey}`}
            className="text-2xl font-bold hover:text-yellow-300 transition duration-300"
          >
            <FaHome className="inline-block mr-2" />
            {t("nav.rimIjar")}
          </Link>
        </div>

        {/* Bouton Mobile */}
        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <FaBars size={24} />
          </button>
        </div>

        {/* Liens Desktop */}
        <div className="hidden sm:flex gap-4">
          <Link
            id="connexion"
            data-cy="connexion"
            href={`/${localeKey}/p/users/connexion`}
            className="flex items-center hover:bg-green-500 px-3 py-2 text-black bg-white rounded-xl transition duration-300"
          >
            <FaSignInAlt className="mr-2" />
            {t("nav.login")}
          </Link>

          {/* Switch langue - desktop */}
          {!isAr ? (
            <button
              onClick={() => switchLocale("ar")}
              className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              العربية
            </button>
          ) : (
            <button
              onClick={() => switchLocale("fr")}
              className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition durée-300"
            >
              français
            </button>
          )}
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-2">
          <Link
            id="connexion"
            data-cy="connexion"
            href={`/${localeKey}/p/users/connexion`}
            className="flex items-center justify-center hover:bg-green-500 px-3 py-2 text-black bg-white rounded-xl transition duration-300"
          >
            <FaSignInAlt className="mr-2" />
            {t("nav.login")}
          </Link>

          {/* Switch langue - mobile */}
          {!isAr ? (
            <button
              onClick={() => {
                switchLocale("ar");
                setIsOpen(false);
              }}
              className="flex items-center justify-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              العربية
            </button>
          ) : (
            <button
              onClick={() => {
                switchLocale("fr");
                setIsOpen(false);
              }}
              className="flex items-center justify-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              français
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
