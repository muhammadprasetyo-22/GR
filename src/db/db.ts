import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

function getMongoUri(): string {
  return process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/guyubrukun';
}

function getDbName(): string | undefined {
  if (process.env.MONGODB_DB_NAME) return process.env.MONGODB_DB_NAME;
  const uri = getMongoUri();
  // Check if URI already has a specific database path, e.g. /guyubrukun or /test
  const match = uri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([a-zA-Z0-9_-]+)(?:\?|$)/);
  if (match && match[1]) {
    return match[1];
  }
  // If no db path in URI, default to 'guyubrukun'
  return 'guyubrukun';
}

/**
 * Global interface for Mongoose cache on Node.js global object
 * Crucial for Vercel Serverless Functions to prevent connection exhaustion
 * across warm Lambda / Serverless container invocations.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Optimized MongoDB Connection with Connection Caching for Vercel Serverless
 */
export async function connectDB(): Promise<typeof mongoose> {
  // 1. If connection already active, reuse existing connection immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. If connection is already establishing, wait for the pending promise
  if (!cached.promise) {
    const mongoUri = getMongoUri();
    const targetDbName = getDbName();
    const opts: mongoose.ConnectOptions = {
      ...(targetDbName ? { dbName: targetDbName } : {}),
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Optimal pool size per serverless container to prevent exhaustion
      minPoolSize: 1,
      retryWrites: true,
      retryReads: true,
      autoIndex: process.env.NODE_ENV !== 'production', // Prevent blocking index creation in production cold starts
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
      const activeDb = mongooseInstance.connection.db?.databaseName || targetDbName;
      console.log(`[MongoDB] Connected securely to target database '${activeDb}' with connection caching enabled.`);
      return mongooseInstance;
    }).catch((err) => {
      console.error('[MongoDB] Connection initialization error:', err);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default connectDB;
