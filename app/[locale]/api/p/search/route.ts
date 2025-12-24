import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "../../../../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    


    const db = await getDb();
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("jwt");
    body.userId = "";
    if (jwtCookie && process.env.JWT_SECRET) {
      try {
        const decodedToken = jwt.verify(jwtCookie.value, process.env.JWT_SECRET);
        if (typeof decodedToken === 'object' && decodedToken !== null && 'id' in decodedToken) {
           body.userId = (decodedToken as any).id;
        }
      } catch (err) {
        console.error("Token verification failed in search analytics:", err);
      }
    }
    await db.collection("search").insertOne(body);
    return NextResponse.json(body);
  } catch (error: any) {
    console.error("Erreur connexion:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}