import type { Metadata } from "next";
import Locale from "intl-locale-textinfo-polyfill";
import "./globals.css";
import ConditionalNav from "./layout/ConditionalNav";
import { Providers } from "./layout/providers";
import { cookies } from "next/headers";
import Script from "next/script"; // ✅ ajouter l'import

export const metadata: Metadata = {
  title: "eddeyar",
  description: "trouver des maisons,appartement, voiture, engine a louer",
};

import { Inter, Almarai } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"], // Added weights for better hierarchy
  variable: "--font-almarai",
});

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{
      locale: string;
    }>;
  }>,
) {
  const params = await props.params;
  const { children } = props;

  let dir = "ltr"; 
  let fontClass = inter.variable;

  try {
    if (params.locale) {
      const locale = new Locale(params.locale);
      dir = locale.textInfo.direction;
      if (dir === "rtl" || params.locale.startsWith("ar")) {
        fontClass = almarai.variable;
      }
    }
  } catch (error) {
    console.error("Invalid locale provided:", params.locale, error);
  }
  const hasSession = (await cookies()).has("jwt");

  return (
    <html lang={params.locale} dir={dir}>
      <head>
        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2WW4N8MP60"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2WW4N8MP60', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        
      </head>
      <body className={`${fontClass} ${dir === "rtl" ? "font-arabic" : "font-sans"} bg-gray-50 text-gray-900 min-h-screen antialiased pb-24 lg:pb-0`}>
        <Providers locale={params.locale}>
          <ConditionalNav lang={params.locale} isAuthenticated={hasSession} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
