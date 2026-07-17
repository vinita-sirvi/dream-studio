import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
);

const envSchema = z.object({
  MONGODB_URI: optionalString,
  MONGODB_DB: optionalString,
  RESEND_API_KEY: optionalString,
  RESEND_FROM_EMAIL: optionalString,
  APP_URL: optionalString,
  SESSION_SECRET: optionalString,
  ADMIN_EMAILS: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export function getRequiredEnv(name: keyof typeof envSchema.shape): string {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getAdminEmails(): string[] {
  return (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}
