import { createClient } from "@libsql/client";
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL_LIEUX!,
  authToken: process.env.TURSO_AUTH_TOKEN_LIEUX!,
});
