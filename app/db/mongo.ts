import { Db, MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise() {
  if (global._mongoClientPromise) {
    return global._mongoClientPromise;
  }

  if (clientPromise) {
    return clientPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  const client = new MongoClient(uri);
  clientPromise = client.connect();
  global._mongoClientPromise = clientPromise;
  return clientPromise;
}

export async function connectToDatabase(): Promise<Db> {
  const dbName = process.env.MONGODB_DB_NAME;
  if (!dbName) {
    throw new Error("Missing MONGODB_DB_NAME");
  }

  const client = await getClientPromise();
  return client.db(dbName);
}
