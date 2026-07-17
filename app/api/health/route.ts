import { isDatabaseConfigured } from "@/lib/mongodb";
import { jsonResponse } from "@/lib/http";

export async function GET() {
  return jsonResponse({
    ok: true,
    service: "dream-studio",
    databaseConfigured: isDatabaseConfigured(),
    timestamp: new Date().toISOString(),
  });
}
