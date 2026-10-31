import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URL;
if (!uri) {
  throw new Error("MONGODB_URL is not set in .env.local");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb(dbName?: string): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
