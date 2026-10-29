import { actionsByName } from "../data/actions";
import { aspectsByName } from "../data/aspects";
import { speciesByName } from "../data/species";
import { spellTraitsByName } from "../data/spellTraits";
import type { Action } from "../types/Action";
import type { Species } from "../types/Species";
import type { Aspect, SpellTrait } from "../types/Spells";

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

export function lookupAspects(
  raw: string | string[] | undefined | null,
): Aspect[] {
  return splitList(raw)
    .map((name) => aspectsByName[name])
    .filter(Boolean) as Aspect[];
}

export function lookupSpellTraits(
  raw: string | string[] | undefined | null,
): SpellTrait[] {
  return splitList(raw)
    .map((name) => spellTraitsByName[name])
    .filter(Boolean) as SpellTrait[];
}
