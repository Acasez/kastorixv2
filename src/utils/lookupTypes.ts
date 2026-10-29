//utils/lookupTypes.ts
import { splitList } from "./strings";

export function lookup<T>(
  table: Record<string, T>,
  raw: string | string[] | undefined | null,
): T[] {
  return splitList(raw)
    .map((name) => table[name])
    .filter(Boolean) as T[];
}

export function lookupOne<T>(
  table: Record<string, T>,
  name: string | undefined | null,
): T | undefined {
  if (!name) return undefined;
  return table[name.trim()];
}
