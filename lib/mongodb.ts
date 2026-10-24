import { MongoClient, type Db } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

/**
 * Returns the cached MongoClient instance, initializing it lazily if needed.
 * In development, reuses global connection across HMR cycles.
 * In production (Vercel Serverless), caches connection across warm invocations.
 */
export async function getClient(): Promise<MongoClient> {
  if (clientPromise) {
    return clientPromise;
  }

  let uri = process.env.MONGODB_URI;
  if (!uri && process.env.NODE_ENV !== 'production') {
    try {
      const dotenv = await import('dotenv');
      dotenv.config({ path: '.env.local' });
      dotenv.config();
      uri = process.env.MONGODB_URI;
    } catch {
      // In environments where dotenv is not available, proceed to check
    }
  }

  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local or Vercel Settings');
  }

  uri = uri.trim().replace(/^["']|["']$/g, '');

  const clientOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  };

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, clientOptions);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, clientOptions);
    clientPromise = client.connect();
  }

  return clientPromise;
}

/**
 * Returns a handle to the target MongoDB database.
 * @param dbName Optional database name override (defaults to MONGODB_DB_NAME or 'duo_spa').
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  const targetDbName = dbName || process.env.MONGODB_DB_NAME || 'duo_spa';
  const client = await getClient();
  return client.db(targetDbName);
}

export default getClient;
