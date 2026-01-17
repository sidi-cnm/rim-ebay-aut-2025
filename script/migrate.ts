import { MongoClient, Db } from "mongodb";
import { createClient } from "@libsql/client";
import { OldAnnonce, MigrationUpdate } from "./types";
import "dotenv/config";

// Connection settings
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set.`);
  }
  return value;
}

function getDbNameFromUri(uri: string): string {
  const url = new URL(uri);
  const dbName = url.pathname.replace("/", "");
  if (!dbName) {
    throw new Error("DATABASE_URL must include a database name.");
  }
  return dbName;
}
const MONGO_URI = requiredEnv("DATABASE_URL")
const DB_NAME = getDbNameFromUri(MONGO_URI);
const COLLECTION_NAME = "annonces";

// Turso client for options (typeAnnonce, categories)
const tursoOptions = createClient({
  url: process.env.TURSO_DATABASE_URL_OPTIONS!,
  authToken: process.env.TURSO_AUTH_TOKEN_OPTIONS!,
});

// Turso client for lieux (wilayas, moughataas)
const tursoLieux = createClient({
  url: process.env.TURSO_DATABASE_URL_LIEUX!,
  authToken: process.env.TURSO_AUTH_TOKEN_LIEUX!,
});

class AnnonceMigration {
  private client: MongoClient;
  private db!: Db;

  constructor(uri: string) {
    this.client = new MongoClient(uri);
  }

  /**
   * Connect to the database
   */
  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(DB_NAME);
      console.log("✅ Connected to the database");
    } catch (error) {
      console.error("❌ Connection error:", error);
      throw error;
    }
  }

  /**
   * Close the connection
   */
  async close(): Promise<void> {
    await this.client.close();
    console.log("🔌 Connection closed");
  }

  /**
   * Fetch annonce type name from Turso Options
   */
  private async getTypeAnnonceName(id: string): Promise<string> {
    try {
      const result = await tursoOptions.execute({
        sql: "SELECT name FROM options WHERE id = ?",
        args: [Number(id)],
      });
      return (result.rows[0]?.name as string) || "";
    } catch (error) {
      console.warn(`⚠️ typeAnnonce not found: ${id}`, error);
      return "";
    }
  }

  /**
   * Fetch annonce type name in Arabic from Turso Options
   */
  private async getTypeAnnonceNameAr(id: string): Promise<string> {
    try {
      const result = await tursoOptions.execute({
        sql: "SELECT nameAr FROM options WHERE id = ?",
        args: [Number(id)],
      });
      return (result.rows[0]?.nameAr as string) || "";
    } catch (error) {
      console.warn(`⚠️ typeAnnonce not found: ${id}`);
      return "";
    }
  }

  /**
   * Fetch category name from Turso Options
   */
  private async getCategorieName(id: string): Promise<string> {
    try {
      const result = await tursoOptions.execute({
        sql: "SELECT name FROM options WHERE id = ?",
        args: [Number(id)],
      });
      return (result.rows[0]?.name as string) || "";
    } catch (error) {
      console.warn(`⚠️ category not found: ${id}`);
      return "";
    }
  }

  /**
   * Fetch category name in Arabic from Turso Options
   */
  private async getCategorieNameAr(id: string): Promise<string> {
    try {
      const result = await tursoOptions.execute({
        sql: "SELECT nameAr FROM options WHERE id = ?",
        args: [Number(id)],
      });
      return (result.rows[0]?.nameAr as string) || "";
    } catch (error) {
      console.warn(`⚠️ category not found: ${id}`);
      return "";
    }
  }

  /**
   * Fetch location (wilaya) name from Turso Lieux
   */
  private async getLieuStr(id: string): Promise<string> {
    try {
      const result = await tursoLieux.execute({
        sql: "SELECT name FROM options WHERE id = ? AND tag = 'wilaya'",
        args: [Number(id)],
      });
      return (result.rows[0]?.name as string) || "";
    } catch (error) {
      console.warn(`⚠️ lieu not found: ${id}`);
      return "";
    }
  }

  /**
   * Fetch location (wilaya) name in Arabic from Turso Lieux
   */
  private async getLieuStrAr(id: string): Promise<string> {
    try {
      const result = await tursoLieux.execute({
        sql: "SELECT nameAr FROM options WHERE id = ? AND tag = 'wilaya'",
        args: [Number(id)],
      });
      return (result.rows[0]?.nameAr as string) || "";
    } catch (error) {
      console.warn(`⚠️ lieu not found: ${id}`);
      return "";
    }
  }

  /**
   * Fetch moughataa name from Turso Lieux
   */
  private async getMoughataaStr(id: string): Promise<string> {
    try {
      const result = await tursoLieux.execute({
        sql: "SELECT name FROM options WHERE id = ? AND tag = 'moughataa'",
        args: [Number(id)],
      });
      return (result.rows[0]?.name as string) || "";
    } catch (error) {
      console.warn(`⚠️ moughataa not found: ${id}`);
      return "";
    }
  }

  /**
   * Fetch moughataa name in Arabic from Turso Lieux
   */
  private async getMoughataaStrAr(id: string): Promise<string> {
    try {
      const result = await tursoLieux.execute({
        sql: "SELECT nameAr FROM options WHERE id = ? AND tag = 'moughataa'",
        args: [Number(id)],
      });
      return (result.rows[0]?.nameAr as string) || "";
    } catch (error) {
      console.warn(`⚠️ moughataa not found: ${id}`);
      return "";
    }
  }

  /**
   * Build update object for a single annonce
   */
  private async buildUpdateObject(doc: OldAnnonce): Promise<MigrationUpdate> {
    const [
      typeAnnonceName,
      typeAnnonceNameAr,
      categorieName,
      categorieNameAr,
      lieuStr,
      lieuStrAr,
      moughataaStr,
      moughataaStrAr,
    ] = await Promise.all([
      this.getTypeAnnonceName(doc.typeAnnonceId),
      this.getTypeAnnonceNameAr(doc.typeAnnonceId),
      this.getCategorieName(doc.categorieId),
      this.getCategorieNameAr(doc.categorieId),
      this.getLieuStr(doc.lieuId),
      this.getLieuStrAr(doc.lieuId),
      this.getMoughataaStr(doc.moughataaId),
      this.getMoughataaStrAr(doc.moughataaId),
    ]);

    return {
      rentalPeriod: "",
      rentalPeriodAr: "",
      typeAnnonceName,
      categorieName,
      typeAnnonceNameAr,
      categorieNameAr,
      lieuStr,
      lieuStrAr,
      moughataaStr,
      moughataaStrAr,
      isPriceHidden: false,
      privateDescription: "",
    };
  }

  /**
   * Run migration
   */
  async migrate(): Promise<void> {
    try {
      const collection = this.db.collection<OldAnnonce>(COLLECTION_NAME);

      // Fetch old documents (missing or empty location fields)
      const oldDocs = await collection
        .find({
          $or: [
            { lieuStr: { $exists: false } },
            { lieuStr: null },
            { lieuStr: "" },
            { moughataaStr: { $exists: false } },
            { moughataaStr: null },
            { moughataaStr: "" },
          ],
        })
        .toArray();

      console.log(`📦 Found ${oldDocs.length} old documents`);

      if (oldDocs.length === 0) {
        console.log("✅ All documents are already up to date");
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      // Update each document
      for (let i = 0; i < oldDocs.length; i++) {
        const doc = oldDocs[i];

        try {
          console.log(`⏳ [${i + 1}/${oldDocs.length}] Processing: ${doc._id}`);

          const update = await this.buildUpdateObject(doc);

          const result = await collection.updateOne(
            { _id: doc._id },
            { $set: update }
          );

          if (result.modifiedCount > 0) {
            successCount++;
            console.log("   ✅ Updated successfully");
          } else {
            console.log("   ⚠️ Not updated (maybe already updated)");
          }
        } catch (error) {
          errorCount++;
          console.error(`   ❌ Error updating ${doc._id}:`, error);
        }
      }

      console.log("\n" + "=".repeat(50));
      console.log("✅ Migration completed");
      console.log("📊 Results:");
      console.log(`   • Updated successfully: ${successCount}`);
      console.log(`   • Failed updates: ${errorCount}`);
      console.log(`   • Total: ${oldDocs.length}`);
      console.log("=".repeat(50));
    } catch (error) {
      console.error("❌ Migration error:", error);
      throw error;
    }
  }

  /**
   * Verify results
   */
  async verify(): Promise<void> {
    try {
      const collection = this.db.collection(COLLECTION_NAME);

      const withLocationFields = await collection.countDocuments({
        lieuStr: { $exists: true, $nin: [null, ""] },
        moughataaStr: { $exists: true, $nin: [null, ""] },
      });

      const withoutLocationFields = await collection.countDocuments({
        $or: [
          { lieuStr: { $exists: false } },
          { lieuStr: null },
          { lieuStr: "" },
          { moughataaStr: { $exists: false } },
          { moughataaStr: null },
          { moughataaStr: "" },
        ],
      });

      const total = await collection.countDocuments();

      console.log("\n📊 Verification results:");
      console.log(`   • With location fields: ${withLocationFields}`);
      console.log(`   • Without location fields: ${withoutLocationFields}`);
      console.log(`   • Total: ${total}`);
    } catch (error) {
      console.error("❌ Verification error:", error);
    }
  }
}

/**
 * Run the script
 */
async function main() {
  const migration = new AnnonceMigration(MONGO_URI);

  try {
    await migration.connect();

    console.log("🚀 Starting migration...\n");

    await migration.migrate();
    await migration.verify();
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await migration.close();
  }
}

// Run the script
main();
