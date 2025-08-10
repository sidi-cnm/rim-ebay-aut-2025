// locales/server.ts
import { createI18nServer } from "next-international/server";

export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
  fr: () => import("./translations/fr"),
  ar: () => import("./translations/ar"),
});
