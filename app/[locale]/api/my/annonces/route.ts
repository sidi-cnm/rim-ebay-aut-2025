// app/[locale]/api/my/annonces/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { getDb } from "../../../../../lib/mongodb";
import { getUserFromCookies } from "../../../../../utiles/getUserFomCookies";

// ---- Config upload ----
const MAX_FILES = 8;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

function safeName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
}


// recuperation de user contatc function :

async function getUserContact(db: any, userIdStr: string): Promise<string | null> {
  // 1) contact vérifié/actif
  const verified = await db.collection("contacts").findOne(
    { userId: userIdStr, isVerified: true, isActive: true },
    { projection: { contact: 1 } }
  );
  if (verified?.contact) return String(verified.contact);

  // 2) le plus récent
  const latest = await db.collection("contacts")
    .find({ userId: userIdStr }, { projection: { contact: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(1)
    .next();
  if (latest?.contact) return String(latest.contact);

  return null;
}


// ---- Upload + persistance DB (images + annonce_images + update annonce) ----
async function uploadAnnonceImagesAndPersist(
  db: any,
  annonceId: ObjectId,
  files: File[],
  mainIndex: number
) {
  if (files.length === 0) {
    return { images: [] as string[], firstImagePath: null as string | null };
  }
  if (files.length > MAX_FILES) {
    throw new Error(`Max ${MAX_FILES} images`);
  }
  if (!Number.isFinite(mainIndex) || mainIndex < 0 || mainIndex >= files.length) {
    mainIndex = 0;
  }

  const now = new Date();
  const uploaded: { url: string; contentType: string; key: string }[] = [];

  for (const file of files) {
    if (!ALLOWED_MIME.includes(file.type)) {
      throw new Error(`Type non autorisé: ${file.type}`);
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(`Fichier trop volumineux (>10MB)`);
    }

    const key = `annonces/${annonceId.toString()}/${randomUUID()}-${safeName(file.name || "image")}`;

    const { url } = await put(key, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type,
      addRandomSuffix: false,
    });

    uploaded.push({ url, contentType: file.type, key });
  }

  // Persiste chaque image dans `images`
  const imageIds: ObjectId[] = [];
  for (const u of uploaded) {
    try {
      const res = await db.collection("images").insertOne({
        imagePath: u.url,
        createdAt: now,
        altText: null,
      });
      imageIds.push(res.insertedId);
    } catch (e: any) {
      if (e?.code === 11000) {
        const existing = await db
          .collection("images")
          .findOne({ imagePath: u.url }, { projection: { _id: 1 } });
        if (existing?._id) imageIds.push(existing._id);
        else throw e;
      } else {
        throw e;
      }
    }
  }

  // Liaisons annonce↔images
  const links = imageIds.map((imgId) => ({
    annonceId,
    imageId: imgId,
    createdAt: now,
  }));
  if (links.length) {
    try {
      await db.collection("annonce_images").insertMany(links, { ordered: false });
    } catch (e: any) {
      if (e?.code !== 11000) throw e;
    }
  }

  const firstImagePath = uploaded[mainIndex]?.url ?? uploaded[0].url;

  // Update annonce
  await db.collection("annonces").updateOne(
    { _id: annonceId },
    { $set: { haveImage: true, firstImagePath, updatedAt: new Date() } }
  );

  return { images: uploaded.map((u) => u.url), firstImagePath };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const db = await getDb();

    // ---------- Auth ----------
    const user = await getUserFromCookies();
    const userIdStr = String(user?.id ?? "");
    if (!userIdStr) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    const now = new Date();
    const contentType = request.headers.get("content-type") || "";
    console.log("POST my/annonces content-type:", contentType);

    

    // ============================================================
    // ========== BRANCHE MULTIPART (wizard Step 3) ===============
    // ============================================================
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();

      console.log("form keys:", [...form.keys()]);
      // -------- Champs principaux (Step 1) --------
      const typeAnnonceId  = String(form.get("typeAnnonceId") ?? "");
      const categorieId    = String(form.get("categorieId") ?? "");
      const subcategorieId = String(form.get("subcategorieId") ?? "");
      const title          = String(form.get("title") ?? "");
      const description    = String(form.get("description") ?? "");
      const priceStr       = form.get("price");
      const price          = priceStr != null && String(priceStr) !== "" ? Number(priceStr) : null;
      const directNegotiation =  String(form.get("directNegotiation"));
      const classificationFr = form.get("classificationFr") ? String(form.get("classificationFr")) : null;
      const classificationAr = form.get("classificationAr") ? String(form.get("classificationAr")) : null;


     
      // -------- Localisation (Step 3) --------
      const lieuId         = String(form.get("lieuId") ?? "");        // wilaya
      const moughataaId    = String(form.get("moughataaId") ?? "");   // moughataa
      const status         = String(form.get("status") ?? "active");

     
      // -------- Images (Step 2) --------
      const files = [
        ...form.getAll("files"),
        ...form.getAll("image"),
        ...form.getAll("images"),
      ].filter((f): f is File => f instanceof File);

      console.log(`Received ${files.length} files`);
      let mainIndex = Number(String(form.get("mainIndex") ?? "0"));
      if (!Number.isFinite(mainIndex) || mainIndex < 0) mainIndex = 0;
      
      console.log("mainIndex:", mainIndex);
      
      

      // -------- Validation champs essentiels --------
      if (!typeAnnonceId || !categorieId || !subcategorieId || !description || !price) {
        return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
      }

      const contact = await getUserContact(db, userIdStr);

     
      const annonceDoc: any = {
        typeAnnonceId,
        categorieId,
        subcategorieId,
        userId: userIdStr,
        classificationFr,
        classificationAr,
        title,
        description,
        price,
        status,
        isPublished: false,
        lieuId: lieuId || null,
        contact,
        moughataaId: moughataaId || null,
        haveImage: false,
        directNegotiation,
        firstImagePath: '',
        createdAt: now,
        updatedAt: now,
      };
      console.log("Creating annonce2:", annonceDoc);

      let insertedId: ObjectId;
      try {
        const insertRes = await db.collection("annonces").insertOne(annonceDoc);
        console.log("Annonce created with ID:", insertRes.insertedId.toString());
        insertedId = insertRes.insertedId as ObjectId;
      } catch (e: any) {
        // Si tu as créé un index unique (userId, idempotencyKey), rattrape le doublon
        if (e?.code === 11000) {
          const existing = await db
            .collection("annonces")
            .findOne({ userId: userIdStr }, { projection: { _id: 1, haveImage: 1, firstImagePath: 1 } });
          if (existing?._id) {
            return NextResponse.json(
              {
                id: existing._id.toString(),
                haveImage: existing.haveImage ?? false,
                firstImagePath: existing.firstImagePath ?? null,
              },
              { status: 201 }
            );
          }
        }
        throw e;
      }

      // -------- Upload intégré (PAS d’appel à /api/images) --------
      if (files.length > 0) {
        try {
          const { firstImagePath } = await uploadAnnonceImagesAndPersist(db, insertedId, files, mainIndex);
          // annonce déjà mise à jour dans la fonction
          return NextResponse.json(
            {
              id: insertedId.toString(),
              ...annonceDoc,
              haveImage: true,
              firstImagePath,
            },
            { status: 201 }
          );
        } catch (e: any) {
          // échec upload → on garde l’annonce sans images (plus simple), et on remonte l’erreur
          return NextResponse.json(
            { id: insertedId.toString(), ...annonceDoc, haveImage: false, firstImagePath: null, uploadError: String(e?.message ?? e) },
            { status: 201 }
          );
        }
      }

      // -------- Pas d'images --------
      return NextResponse.json(
        { id: insertedId.toString(), ...annonceDoc },
        { status: 201 }
      );
    }

    // ============================================================
    // ========== BRANCHE JSON (compat facultative) ===============
    // ============================================================
    const data = await request.json().catch(() => null);
    if (!data) return NextResponse.json({ error: "Bad payload" }, { status: 400 });

    const required = ["typeAnnonceId", "subcategorieId", "categorieId", "title", "description", "status"] as const;
    const missing = required.find((k) => {
      const v = data[k];
      return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
    });
    if (missing) {
      return NextResponse.json({ error: `Champ requis manquant: ${missing}` }, { status: 400 });
    }


    console.log("data payload:", data);
    
    const annonceDoc = {
      typeAnnonceId: String(data.typeAnnonceId),
      subcategorieId: String(data.subcategorieId),
      categorieId: String(data.categorieId),
      userId: userIdStr,
      title: data.title,
      description: data.description,
      price: typeof data.price === "number" ? data.price : null,
      haveImage: Boolean(data.haveImage ?? false),
      firstImagePath: data.firstImagePath ?? '',
      status: data.status,
      isPublished: false,
      lieuId: data.lieuId ? String(data.lieuId) : null,
      moughataaId: data.moughataaId ? String(data.moughataaId) : null,
      createdAt: now,
      updatedAt: now,
    };

    let insertedId: ObjectId;
    try {
      const result = await db.collection("annonces").insertOne(annonceDoc);
      insertedId = result.insertedId as ObjectId;
    } catch (e: any) {
      if (e?.code === 11000) {
        const existing = await db
          .collection("annonces")
          .findOne({ userId: userIdStr }, { projection: { _id: 1, haveImage: 1, firstImagePath: 1 } });
        if (existing?._id) {
          return NextResponse.json(
            {
              id: existing._id.toString(),
              haveImage: existing.haveImage ?? false,
              firstImagePath: existing.firstImagePath ?? null,
            },
            { status: 201 }
          );
        }
      }
      throw e;
    }

    return NextResponse.json({ ...annonceDoc, id: insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("POST my/annonces error:", error);
    return NextResponse.json({ error: "Error creating annonce" }, { status: 500 });
  }
}
