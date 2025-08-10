// app/api/annonces/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { cookies } from "next/headers";
const SiteBaseUrl = process.env.SITE_BASE_URL || "";
console.log("Site Base URL:", SiteBaseUrl);
let baseApi = "fr/p/api/tursor";
if (process.env.NEXT_PUBLIC_OPTIONS_API_MODE === "sqlite") {
  baseApi = "fr/p/api/sqlite";
}
console.log("Base API URL:", baseApi);

function getUserFromHeaders(request: NextRequest) {
  return {
    id: request.headers.get("x-user-id"),
    email: request.headers.get("x-user-email"),
    role: request.headers.get("x-user-role"),
  };
}


// Définition des types pour la requête
interface CreateAnnonceRequest {
  typeAnnonceId: string;
  subcategorieId: string;
  categorieId: string;
  lieuId: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  contact: string;
  haveImage: boolean;
  firstImagePath: string;
  images: { imagePath: string }[];
  status: string;
}

// 1. Créer une annonce (POST)
export async function POST(request: NextRequest): Promise<NextResponse> {
  // recuperer l'id de l'utilisateur depuis le token JWT ou la session
  // recuprer le contacr de l'utilisateur depuis la base des donnnees
    const userInheaders = getUserFromHeaders(request);
  console.log("User from headers:", userInheaders);

  const userid = (await cookies()).get("user");
  const userIdConverted = String(userid?.value || "");
  let contact = ""
  const user = await prisma.user.findUnique({
    where: {
      id: userIdConverted,
    },
  }).catch((err) => {
    console.error("Error fetching user:", err);
    // Handle the error as needed, e.g., redirect or show an error message
  });
  console.log("User ID:", userIdConverted);
  console.log("User:", user);
  if (user) {
    //contact = user.contact || "";
    const contactObject = await prisma.contact.findFirst(
      {where : {
        userId:user.id
      }}
    )
    if(contactObject){
      contact = contactObject.contact ? contactObject.contact: ""
    }
  }

  try {
    const data: CreateAnnonceRequest = await request.json();

    // Créer une nouvelle annonce dans la base de données
    const newAnnonce = await prisma.annonce.create({
      data: {
        typeAnnonceId: data.typeAnnonceId,
        subcategorieId: data.subcategorieId,
        categorieId: data.categorieId,
        lieuId: data.lieuId,
        userId: userIdConverted,
        //data.userId,
        title: data.title,
        description: data.description,
        price: data.price,
        contact, 
        //data.contact,
        haveImage: data.haveImage,
        firstImagePath: data.firstImagePath,

        status: data.status,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    });

    return NextResponse.json(newAnnonce, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'annonce:", error); // Afficher l'erreur dans les logs
    return NextResponse.json(
      { error: "Error creating annonce", details: error },
      { status: 500 },
    );
  }
}
