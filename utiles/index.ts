import jwt from "jsonwebtoken";
interface DecodedToken {
  id: string;
  email: string;
  sessionToken: string;
  iat: number;
  exp: number;
}

export function decodeToken(token: string): { userId: string; email: string } {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret-key",
    ) as DecodedToken;
    return {
      userId: decoded.id,
      email: decoded.email,
    };
  } catch (error) {
    throw new Error("Token invalide ou expiré");
  }
}
