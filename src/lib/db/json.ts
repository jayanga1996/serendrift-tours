export function asJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  if (Buffer.isBuffer(value)) {
    try {
      return JSON.parse(value.toString("utf8")) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

export function asFlag(value: unknown) {
  return value === true || value === 1 || value === "1";
}

export function asText(value: unknown) {
  return value == null ? "" : String(value);
}
