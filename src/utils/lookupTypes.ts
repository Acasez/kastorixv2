//utils/lookupTypes.ts
import { actionsByName } from "../data/actions";
import { aspectsByName } from "../data/aspects";
import { skillsByName } from "../data/skills";
import { speciesByName } from "../data/species";
import { spellTraitsByName } from "../data/spellTraits";
import { splitList } from "./strings";

export function lookup<T>(
  table: Record<string, T>,
  raw: string | string[] | undefined | null,
): T[] {
  return splitList(raw)
    .map((name) => table[name])
    .filter(Boolean) as T[];
}

export const lookupActions = (raw?: string | string[] | null) =>
  lookup(actionsByName, raw);
export const lookupSpecies = (raw?: string | string[] | null) =>
  lookup(speciesByName, raw);
export const lookupAspects = (raw?: string | string[] | null) =>
  lookup(aspectsByName, raw);
export const lookupSpellTraits = (raw?: string | string[] | null) =>
  lookup(spellTraitsByName, raw);
export const lookupSkills = (raw?: string | string[] | null) =>
  lookup(skillsByName, raw);
