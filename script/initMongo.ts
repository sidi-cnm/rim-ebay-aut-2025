// scripts/initMongo.ts
import { MongoClient, Db } from "mongodb";
import 'dotenv/config';

// --- Helpers ---------------------------------------------------------------

console.log(process.env.DATABASE_URL )
function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Environment variable ${name} is required but not set.`);
  }
  return v;
}

async function ensureCollection(db: Db, name: string, validator?: any) {
  const exists = await db.listCollections({ name }).hasNext();
  if (!exists) {
    await db.createCollection(
      name,
      validator ? { validator, validationLevel: "moderate" } : undefined
    );
    console.log(`✅ Created collection: ${name}`);
  } else if (validator) {
    await db.command({ collMod: name, validator, validationLevel: "moderate" });
    console.log(`🔧 Updated validator for: ${name}`);
  } else {
    console.log(`ℹ️ Collection already exists: ${name}`);
  }
}

async function ensureIndexes(db: Db) {
  await db.collection("users").createIndex({ email: 1 }, { unique: true, name: "uniq_email" });
  await db.collection("users").createIndex({ createdAt: -1 }, { name: "by_createdAt" });

  await db.collection("password_resets").createIndex({ token: 1 }, { name: "by_token" });
  await db.collection("password_resets").createIndex({ expiresAt: 1 }, { name: "by_expiresAt" });

  await db.collection("contacts").createIndex({ userId: 1 }, { name: "by_userId" });
  await db.collection("contacts").createIndex({ isVerified: 1 }, { name: "by_isVerified" });

  await db.collection("user_sessions").createIndex({ userId: 1 }, { name: "by_userId" });
  await db.collection("user_sessions").createIndex({ token: 1 }, { unique: true, name: "uniq_token" });
  await db.collection("user_sessions").createIndex({ lastAccessed: -1 }, { name: "by_lastAccessed" });

  await db.collection("options").createIndex({ tag: 1, priority: -1 }, { name: "by_tag_priority" });
  await db.collection("options").createIndex({ parentID: 1 }, { name: "by_parentID" });

  await db.collection("images").createIndex({ imagePath: 1 }, { unique: true, name: "uniq_imagePath" });
  await db.collection("images").createIndex({ createdAt: -1 }, { name: "by_createdAt" });

  await db.collection("annonces").createIndex({ isPublished: 1, updatedAt: -1 }, { name: "by_published_updated" });
  await db.collection("annonces").createIndex({ typeAnnonceId: 1, categorieId: 1, subcategorieId: 1 }, { name: "by_type_cat_subcat" });
  await db.collection("annonces").createIndex({ userId: 1, createdAt: -1 }, { name: "by_userId_createdAt" });
  await db.collection("annonces").createIndex({ status: 1, isPublished: 1 }, { name: "by_status_published" });
  await db.collection("annonces").createIndex({ price: 1 }, { name: "by_price" });

  await db.collection("annonce_publication_checklist").createIndex({ annonceId: 1 }, { unique: true, name: "uniq_annonceId" });

  await db.collection("annonce_images").createIndex({ annonceId: 1 }, { name: "by_annonceId" });
  await db.collection("annonce_images").createIndex({ imageId: 1 }, { name: "by_imageId" });
  await db.collection("annonce_images").createIndex({ annonceId: 1, imageId: 1 }, { unique: true, name: "uniq_annonce_image" });

  console.log("🗂️ Indexes ensured.");
}

// --- Main ------------------------------------------------------------------

async function run() {
  // ➜ ICI la correction : on exige une vraie string pour l’URI
  const uri = requiredEnv("DATABASE_URL"); // ex: mongodb+srv://user:pwd@cluster/.../rim-ebay
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(); // la DB vient de l’URI (dernière partie de la chaîne)

    console.log(`🔗 Connected to DB: ${db.databaseName}`);

    // --- JSON Schema validators -------------------------------------------
    const userValidator = {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "password", "createdAt", "isActive", "emailVerified"],
        properties: {
          email: { bsonType: "string" },
          password: { bsonType: "string" },
          roleId: { bsonType: ["string", "null"] },
          roleName: { bsonType: ["string", "null"] },
          createdAt: { bsonType: "date" },
          lastLogin: { bsonType: ["date", "null"] },
          isActive: { bsonType: "bool" },
          emailVerified: { bsonType: "bool" },
          verifyToken: { bsonType: ["string", "null"] },
          verifyTokenExpires: { bsonType: ["date", "null"] },
        },
        additionalProperties: true,
      },
    };

    const passwordResetValidator = {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "token", "expiresAt", "createdAt"],
        properties: {
          userId: { bsonType: "string" },
          token: { bsonType: "string" },
          expiresAt: { bsonType: "date" },
          createdAt: { bsonType: "date" },
        },
        additionalProperties: true,
      },
    };

    const contactValidator = {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "createdAt", "isActive", "isVerified", "verifyCode"],
        properties: {
          userId: { bsonType: "string" },
          contact: { bsonType: ["string", "null"] },
          createdAt: { bsonType: "date" },
          isActive: { bsonType: "bool" },
          isVerified: { bsonType: "bool" },
          verifyCode: { bsonType: "string" },
          verifyTokenExpires: { bsonType: ["date", "null"] },
        },
        additionalProperties: true,
      },
    };

    const userSessionValidator = {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "token", "isExpired", "createdAt"],
        properties: {
          userId: { bsonType: "string" },
          token: { bsonType: "string" },
          isExpired: { bsonType: "bool" },
          createdAt: { bsonType: "date" },
          lastAccessed: { bsonType: ["date", "null"] },
        },
        additionalProperties: true,
      },
    };

    const optionsValidator = {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "nameAr", "priority", "depth", "tag", "createdAt"],
        properties: {
          name: { bsonType: "string" },
          nameAr: { bsonType: "string" },
          priority: { bsonType: "int" },
          depth: { bsonType: "int" },
          tag: { bsonType: "string" },
          createdAt: { bsonType: "date" },
          parentID: { bsonType: ["string", "null"] },
        },
        additionalProperties: true,
      },
    };

    const imageValidator = {
      $jsonSchema: {
        bsonType: "object",
        required: ["imagePath"],
        properties: {
          imagePath: { bsonType: "string" },
          createdAt: { bsonType: ["date", "null"] },
          altText: { bsonType: ["string", "null"] },
        },
        additionalProperties: true,
      },
    };

    const annonceValidator = {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "typeAnnonceId",
          "categorieId",
          "lieuId",
          "userId",
          "subcategorieId",
          "title",
          "description",
          "contact",
          "haveImage",
          "status",
          "isPublished",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          typeAnnonceId: { bsonType: "string" },
          categorieId: { bsonType: "string" },
          lieuId: { bsonType: "string" },
          userId: { bsonType: "string" },
          subcategorieId: { bsonType: "string" },
          title: { bsonType: "string" },
          description: { bsonType: "string" },
          price: { bsonType: ["double", "int", "long", "null"] },
          contact: { bsonType: "string" },
          haveImage: { bsonType: "bool" },
          firstImagePath: { bsonType: ["string", "null"] },
          status: { bsonType: "string" },
          isPublished: { bsonType: "bool" },
          updatedAt: { bsonType: "date" },
          createdAt: { bsonType: "date" },
        },
        additionalProperties: true,
      },
    };

    const checklistValidator = {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "annonceId",
          "isContactVerified",
          "isAnnonceVerifiedByIA",
          "isAnnonceVerifiedByAdmin",
          "isAnnonceVerifiedByAssistant",
          "isAllowedToBePublished",
        ],
        properties: {
          annonceId: { bsonType: "string" },
          isContactVerified: { bsonType: "bool" },
          isAnnonceVerifiedByIA: { bsonType: "bool" },
          isAnnonceVerifiedByAdmin: { bsonType: "bool" },
          isAnnonceVerifiedByAssistant: { bsonType: "bool" },
          isAllowedToBePublished: { bsonType: "bool" },
        },
        additionalProperties: true,
      },
    };

    const annonceImageValidator = {
      $jsonSchema: {
        bsonType: "object",
        required: ["annonceId", "imageId", "createdAt"],
        properties: {
          annonceId: { bsonType: "objectId" },
          imageId: { bsonType: "objectId" },
          createdAt: { bsonType: "date" },
        },
        additionalProperties: true,
      },
    };

    // --- Create/Update collections ----------------------------------------
    await ensureCollection(db, "users", userValidator);
    await ensureCollection(db, "password_resets", passwordResetValidator);
    await ensureCollection(db, "contacts", contactValidator);
    await ensureCollection(db, "user_sessions", userSessionValidator);
    await ensureCollection(db, "options", optionsValidator);
    await ensureCollection(db, "images", imageValidator);
    await ensureCollection(db, "annonces", annonceValidator);
    await ensureCollection(db, "annonce_publication_checklist", checklistValidator);
    await ensureCollection(db, "annonce_images", annonceImageValidator);

    await ensureIndexes(db);

    console.log("🎯 All collections, validators and indexes ensured.");
  } finally {
    await client.close();
  }
}

run().catch((err) => {
  console.error("❌ initMongo failed:", err);
  process.exit(1);
});
