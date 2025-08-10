"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaList,
  FaPlus,
  FaBars,
  FaSignInAlt,
  FaTimes,
  FaUserPlus,
} from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "../../../locales/client";

export const NavAuthUI = ({ lang = "ar" }) => {
  const isAr = lang === "ar";
  const router = useRouter();
  const pathname = usePathname(); // Récupère le chemin actuel
  const t = useI18n();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = async () => {
    const response = await fetch(`/${lang}/api/p/users/logout`, {
      method: "POST",
    });
    if (response.ok) {
      router.push(`/`);
      router.refresh();
    }
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // Fonction pour vérifier si la page actuelle est active
  const isActive = (path: any) => pathname === path;

  return (
    <nav className="p-6 bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow-lg">
      <div className="flex justify-between items-center">
        <Link
          href="/"
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

        {/* Drawer pour mobile */}
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
              href={`/${lang}/my/list`}
              className={`flex items-center px-3 py-2 rounded transition duration-300 ${
                isActive(`/${lang}/my/list`)
                  ? "bg-white text-black"
                  : "hover:bg-blue-600"
              }`}
              onClick={toggleDrawer}
            >
              <FaList className="mr-2" />
              {t("nav.myListings")}
            </Link>
            <Link
              href={`/${lang}/my/add`}
              id="addannonce"
              className={`flex items-center px-3 py-2 rounded transition duration-300 ${
                isActive(`/${lang}/my/add`)
                  ? "bg-blue-600"
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
            {!isAr && (
              <Link
                href="/ar"
                className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
                onClick={toggleDrawer}
              >
                العربية
              </Link>
            )}
            {isAr && (
              <Link
                href="/fr"
                className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
                onClick={toggleDrawer}
              >
                français
              </Link>
            )}
          </div>
        </div>

        {/* Liens pour les grands écrans */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link
            href={`/${lang}/my/list`}
            className={`flex items-center px-3 py-2 rounded transition duration-300 ${
              isActive(`/${lang}/my/list`)
                ? "bg-white text-black"
                : "hover:bg-blue-600"
            }`}
          >
            <FaList className="mr-2" />
            {t("nav.myListings")}
          </Link>
          <Link
            href={`/${lang}/my/add`}
            id="addannonce"
            className={`flex items-center px-3 py-2 rounded transition duration-300 ${
              isActive(`/${lang}/my/add`)
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
          {!isAr && (
            <Link
              href="/ar"
              className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              العربية
            </Link>
          )}
          {isAr && (
            <Link
              href="/fr"
              className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              français
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export const NavNonAuthUI = ({ lang = "ar" }) => {
  const isAr = lang === "ar";
  const t = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full p-4 bg-gradient-to-r from-blue-800 to-purple-800 text-white shadow-lg">
      {/* Navbar - Desktop and Mobile Header */}
      <div className="flex justify-between items-center w-full">
        <div>
          <Link
            href={`/${lang}`}
            className="text-2xl font-bold hover:text-yellow-300 transition duration-300"
          >
            <FaHome className="inline-block mr-2" />
            {t("nav.rimIjar")}
          </Link>
        </div>

        {/* Menu Button for Mobile */}
        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <FaBars size={24} />
          </button>
        </div>

        {/* Links for Desktop */}
        <div className="hidden sm:flex gap-4">
          <Link
            id="connexion"
            data-cy="connexion"
            href={`/${lang}/p/users/connexion`}
            className="flex items-center hover:bg-green-500 px-3 py-2 text-black bg-white rounded-xl transition duration-300"
          >
            <FaSignInAlt className="mr-2" />
            {t("nav.login")}
          </Link>
          {!isAr ? (
            <Link
              href="/ar"
              className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              العربية
            </Link>
          ) : (
            <Link
              href="/fr"
              className="flex items-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              français
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-2">
          <Link
            id="connexion"
            data-cy="connexion"
            href={`/${lang}/p/users/connexion`}
            className="flex items-center justify-center hover:bg-green-500 px-3 py-2 text-black bg-white rounded-xl transition duration-300"
          >
            <FaSignInAlt className="mr-2" />
            {t("nav.login")}
          </Link>
          {!isAr ? (
            <Link
              href="/ar"
              className="flex items-center justify-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              العربية
            </Link>
          ) : (
            <Link
              href="/fr"
              className="flex items-center justify-center hover:bg-purple-500 px-3 py-2 rounded transition duration-300"
            >
              français
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
