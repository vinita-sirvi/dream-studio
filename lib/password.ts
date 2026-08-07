import {
  createHash,
  randomBytes,
  randomInt,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}.${derivedKey.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [salt, hash] = storedHash.split(".");
  if (!salt || !hash) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const expectedHash = Buffer.from(hash, "hex");
  return (
    expectedHash.length === derivedKey.length &&
    timingSafeEqual(expectedHash, derivedKey)
  );
}

/**
 * A six-digit login code.
 *
 * Uses `crypto.randomInt`, not `Math.random()`. `Math.random()` is a PRNG seeded
 * from a small state and is not designed to be unpredictable — given a few
 * observed outputs its future values can be recovered, which for a login code is
 * an authentication bypass. `randomInt` draws from the CSPRNG and is uniform
 * (no modulo bias).
 */
export function createOtpCode(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length;
  return String(randomInt(min, max));
}

/**
 * Hash an OTP for storage.
 *
 * The `otpHash` field was storing the code verbatim and comparing it with `!==`,
 * so the column name was a lie: anyone with read access to the users collection
 * could sign in as anybody. A plain SHA-256 is the right tool here rather than
 * scrypt — the input is high-entropy relative to its ten-minute lifetime, and
 * OTP verification sits on a request path that should stay fast.
 */
export function hashOtpCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

/** Constant-time comparison of two OTP hashes. */
export function verifyOtpCode(code: string, storedHash: string | undefined | null) {
  if (!storedHash) return false;

  const expected = Buffer.from(storedHash, "hex");
  const actual = Buffer.from(hashOtpCode(code), "hex");

  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}
