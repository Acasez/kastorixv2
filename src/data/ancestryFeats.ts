import type { Action } from "../types/Action";
import type { AncestryFeat, AncestryFeatType } from "../types/Feats";
import { actionsByName } from "./actions";
import rawAncestryFeats from "../JSON/ancestry_feats.json";
import { parseSpeeds, parseResistances } from "../utils/parseNamedUtils";
import type { Species } from "../types/Species";
import { speciesByName } from "./species";

export const ancestryFeats: AncestryFeat[] = rawAncestryFeats.map((raw) => {
  const rawActions = Array.isArray(raw.unlockedAction)
    ? raw.unlockedAction
    : typeof raw.unlockedAction === "string"
      ? raw.unlockedAction
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const rawSpeciesList = Array.isArray(raw.species)
    ? raw.species
    : typeof raw.species === "string"
      ? raw.species
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return {
    ...raw,
    unlockedActions: rawActions
      .map((name: string) => actionsByName[name])
      .filter(Boolean) as Action[],
    level: Number(raw.level),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.resistances),
    type: raw.type as AncestryFeatType,
    species: rawSpeciesList
      .map((name) => speciesByName[name])
      .filter(Boolean) as Species[],
  };
});

export default ancestryFeats;
