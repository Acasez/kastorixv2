import { actionsByName } from "../data/actions";
import { speciesByName } from "../data/species";
import type { Action } from "../types/Action";
import type { Species } from "../types/Species";

export function splitList(raw: string | string[] | undefined | null): string[] {
  if (!raw) return [];
  return Array.isArray(raw)
    ? raw
    : raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

export function lookupActions(
  raw: string | string[] | undefined | null,
): Action[] {
  return splitList(raw)
    .map((name) => actionsByName[name])
    .filter(Boolean) as Action[];
}

export function lookupSpecies(
  raw: string | string[] | undefined | null,
): Species[] {
  return splitList(raw)
    .map((name) => speciesByName[name])
    .filter(Boolean) as Species[];
}
