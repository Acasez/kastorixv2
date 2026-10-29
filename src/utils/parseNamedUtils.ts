import type { SpeedTypes } from "../types/SpeedTypes";

function parseNamedAmounts<T extends string>(
  raw: string | string[] | undefined | null,
): { name: T; amount: number }[] {
  if (!raw) return [];
  const parts = Array.isArray(raw) ? raw : raw.split(",");

  const out: { name: T; amount: number }[] = [];
  for (const part of parts) {
    const match = part.trim().match(/^(-?\d+)\s+(.+)$/);
    if (!match) continue;
    const name = match[2].trim() as T;
    const amount = Number(match[1]);
    const existing = out.find((s) => s.name === name);
    if (existing) existing.amount += amount;
    else out.push({ name, amount });
  }
  return out;
}

export const parseSpeeds = (raw?: string | string[] | null) =>
  parseNamedAmounts<SpeedTypes>(raw);
export const parseResistances = (raw?: string | null) =>
  parseNamedAmounts<string>(raw);
