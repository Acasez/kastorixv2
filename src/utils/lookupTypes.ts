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
