import mongoose from "mongoose";

import { env } from "./env";

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: CachedConnection | undefined;
}

const cached: CachedConnection = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = cached;
let databaseAvailable: boolean | null = null;

export async function connectToDatabase() {
  if (cached.conn) {
    databaseAvailable = true;
    return cached.conn;
  }

  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB || undefined,
    });
  }

  cached.conn = await cached.promise;
  databaseAvailable = true;
  return cached.conn;
}

export async function tryConnectToDatabase() {
  try {
    await connectToDatabase();
    return true;
  } catch {
    databaseAvailable = false;
    cached.promise = null;
    return false;
  }
}

export function isDatabaseConfigured() {
  return Boolean(env.MONGODB_URI);
}

export function isDatabaseAvailable() {
  return databaseAvailable !== false;
}
