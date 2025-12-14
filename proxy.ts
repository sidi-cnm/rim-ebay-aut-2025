// middleware.ts
import { createI18nMiddleware } from "next-international/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; 
import { getUserFromCookies } from "./utiles/getUserFomCookies";

const I18nMiddleware = createI18nMiddleware({
  locales: ["ar", "fr"],
  defaultLocale: "ar",
});

 
export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  // Exclure favicon.ico
  if (path === "/favicon.ico") {
    return NextResponse.next();
  }  
  const userData = await getUserFromCookies();
 

  // Vérifier si le chemin commence par /my ou /admin
  if (path.startsWith("/fr/my") || path.startsWith("/ar/my") || path.startsWith("/fr/admin")) {
    if (!userData) {
      // Rediriger vers la page de connexion
      url.pathname = `/p/users/connexion`;
      return NextResponse.redirect(url);
    }
  }

  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
