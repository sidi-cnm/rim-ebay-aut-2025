import "dotenv/config";
//require('dotenv').config();
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const SiteBaseUrl = process.env.SITE_BASE_URL || "";
console.log("Site Base URL:", SiteBaseUrl);
let baseApi = "fr/p/api/tursor";
if (process.env.NEXT_PUBLIC_OPTIONS_API_MODE === "sqlite") {
  baseApi = "fr/p/api/sqlite";
}
console.log("Base API URL:", baseApi);

const prisma = new PrismaClient();
console.log("🚀 Initialisation du seeding...");
console.log("🔌 Connexion à la base de données...");
console.log("chaine de connexion : ", process.env.DATABASE_URL);
if (process.env.DATABASE_URL?.startsWith("https")) {
  console.log("you can't seed in production");
  process.exit(1);
}
async function main() {
  console.log("🚀 Début du seeding...");
  // check if there some data : users+annonces

  // 🛑 if yes delete them by hand (in dev mode only, in local)
  // pour eviter d'effacer la base des donnees en production accidentellement

  // 👤 Utilisateurs
  const hashedPassword = await bcrypt.hash("password123", 10);
  const users = await Promise.all(
    [
      "ali@example.com",
      "fatima@example.com",
      "omar@example.com",
      "khadija@example.com",
    ].map((email) =>
      prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          createdAt: new Date(),
          lastLogin: new Date(),
          isActive: true,
          verifyToken:""
        },
      }),
    ),
  );

  console.log("✅ Utilisateurs insérés.");

  // 📢 Génération d'annonces aléatoires
  try {
    const data = {
      typeAnnonceId: "1",
      categorieId: "2",
      subcategorieId: "9",
      lieuId: "1",
      userId: "1",
      title: "data.title",
      description: "data.description",
      price: 5000,
      contact: "22334590",
      haveImage: false,
      firstImagePath: "",

      status: "1",
    };

    // Créer une nouvelle annonce dans la base de données
    await prisma.annonce.create({
      data: {
        typeAnnonceId: data.typeAnnonceId,
        subcategorieId: data.subcategorieId,
        categorieId: data.categorieId,
        lieuId: data.lieuId,
        userId: data.userId,
        title: data.title,
        description: data.description,
        price: data.price,
        contact: data.contact,
        haveImage: data.haveImage,
        firstImagePath: data.firstImagePath,

        status: data.status,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    });
  } catch (error) {}
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
