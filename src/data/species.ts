import rawSpecies from "../JSON/species.json";
import type { Species } from "../types/Species";
import type { CreatureSizes } from "../constants/CreatureSizes";
import { parseSpeeds, parseResistances } from "../utils/parseNamedUtils";
import { lookup } from "../utils/lookupTypes";
import { lookupActions } from "./actions";

export const species: Species[] = rawSpecies.map((raw) => {
  return {
    ...raw,
    size: raw.size as CreatureSizes,
    health: Number(raw.health),
    mana: Number(raw.mana),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.resistances),
    unlockedActions: lookupActions(raw.unlockedActions),
  };
});

export const speciesByName: Record<string, Species> = Object.fromEntries(
  species.map((s) => [s.name, s]),
);

export default species;

export const lookupSpecies = (raw?: string | string[] | null) =>
  lookup(speciesByName, raw);
