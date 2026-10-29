import type { Action } from "../types/Action";
import { actionsByName } from "./actions";
import rawSpecies from "../JSON/species.json";
import type { Species } from "../types/Species";
import type { CreatureSizes } from "../constants/CreatureSizes";
import { parseSpeeds, parseResistances } from "../utils/parseNamedUtils";

export const species: Species[] = rawSpecies.map((raw) => {
  const rawActions = Array.isArray(raw.unlockedAction)
    ? raw.unlockedAction
    : typeof raw.unlockedAction === "string"
      ? raw.unlockedAction
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return {
    ...raw,
    size: raw.size as CreatureSizes,
    health: Number(raw.health),
    mana: Number(raw.mana),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.resistances),
    unlockedActions: rawActions
      .map((name: string) => actionsByName[name])
      .filter(Boolean) as Action[],
  };
});

export const speciesByName: Record<string, Species> = Object.fromEntries(
  species.map((s) => [s.name, s]),
);

export default species;
