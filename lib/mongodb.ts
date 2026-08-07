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

/**
 * Guard for route handlers that cannot do anything useful without a database.
 *
 * Returns a 503 when the database is missing or unreachable, or null to continue.
 *
 * The alternative — calling `connectToDatabase()` directly — throws, and an
 * uncaught throw in a route handler is a 500 with an empty body. So a database
 * blip, or simply a checkout with no `MONGODB_URI` set, turned `GET /api/cart`
 * into an opaque server error with nothing for the client to show a visitor. A
 * 503 with a message is both accurate (the condition is temporary and on our side)
 * and something the UI can render.
 */
export async function ensureDatabase(): Promise<Response | null> {
  const connected = await tryConnectToDatabase();
  if (connected) {
    return null;
  }

  // Imported lazily: lib/http pulls in next/server, and lib/mongodb is also
  // imported from places that have no business loading it.
  const { errorResponse } = await import("./http");
  return errorResponse(
    "The studio's database is unavailable right now. Please try again shortly.",
    503,
  );
}

export function isDatabaseAvailable() {
  return databaseAvailable !== false;
}
