import { createClient } from "@libsql/client";
console.log("TURSO_DATABASE_URL_LIEUX:", process.env.TURSO_DATABASE_URL_LIEUX);
console.log("TURSO_AUTH_TOKEN_LIEUX:", process.env.TURSO_AUTH_TOKEN_LIEUX);
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL_LIEUX!,
  authToken: process.env.TURSO_AUTH_TOKEN_LIEUX!,
});
