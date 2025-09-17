import { cookies } from "next/headers";
import { jwtVerify } from 'jose' 

 
export async function getUserFromCookies() {

  const cookieStore = await cookies();
  const jwtStore = cookieStore.get("jwt");
  let userData: Record<string, any> | null = null;
  if (jwtStore) {
    try {
      // Vérifier la validité du JWT
      if (typeof process.env.JWT_SECRET === "string") {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const token = jwtStore.value
        const { payload } = await jwtVerify(token, secret)

         console.log("Payload from JWT:", payload);

        //console.log(payload)
        // Récupérer les données essentielles de l'utilisateur
        userData = {
          id: payload.id,
          email: payload.email,
          role: payload.roleName,
          samsar: payload.samsar,
        };
        // Injecter dans les headers

        // Si le JWT est valide, on peut continuer
      } else {
        throw new Error("JWT_SECRET environment variable is not defined");
      }
    } catch (error) {

      console.log(`JWT verification failed: ${error instanceof Error ? error.message : String(error)}`);
      // throw new Error(`JWT verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return userData;

}





 