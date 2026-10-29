export function splitList(raw: string | string[] | undefined | null): string[] {
  if (!raw) return [];
  return Array.isArray(raw)
    ? raw
    : raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}
