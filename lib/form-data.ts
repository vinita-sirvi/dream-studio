export function readString(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  if (typeof value === "string") {
    return value.trim();
  }
  return fallback;
}

export function readOptionalString(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value.length > 0 ? value : undefined;
}

export function readNumber(formData: FormData, key: string, fallback = 0) {
  const raw = readString(formData, key);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function readBoolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

export function readList(formData: FormData, key: string) {
  const raw = readString(formData, key);
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
