import rawSpecies from "../JSON/species.json";
import type { Species } from "../types/Species";
import type { CreatureSizes } from "../constants/CreatureSizes";
import { parseSpeeds, parseResistances } from "../utils/parseNamedUtils";
import { lookupActions } from "../utils/lookupTypes";

export const species: Species[] = rawSpecies.map((raw) => {
  return {
    ...raw,
    size: raw.size as CreatureSizes,
    health: Number(raw.health),
    mana: Number(raw.mana),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.resistances),
    unlockedActions: lookupActions(raw.unlockedAction),
  };
});

export const speciesByName: Record<string, Species> = Object.fromEntries(
  species.map((s) => [s.name, s]),
);

export default species;
