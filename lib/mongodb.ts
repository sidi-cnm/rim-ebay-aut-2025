import { MongoClient, Db } from "mongodb";

const uri = process.env.DATABASE_URL;
if (!uri) throw new Error("Please add MONGODB_URI or DATABASE_URL to your .env");

const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 8000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const globalForMongo = global as unknown as { _mongoClientPromise?: Promise<MongoClient> };

// Cache the MongoDB client in both development and production
// This prevents connection exhaustion in serverless environments
if (!globalForMongo._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalForMongo._mongoClientPromise = client.connect();
}
clientPromise = globalForMongo._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const c = await clientPromise;
  // Si la DB est incluse dans l'URI, MongoClient choisit déjà `rim-ebay`
  return c.db();
}
