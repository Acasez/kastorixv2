// data/feats.ts
import rawGeneralFeats from "../JSON/general_feats.json";
import type { Action } from "../types/Action";
import type { GeneralFeat } from "../types/Feats";
import { parseResistances, parseSpeeds } from "../utils/parseNamedUtils";
import { actionsByName } from "./actions";

export const generalFeats: GeneralFeat[] = rawGeneralFeats.map((raw) => {
  const rawActions = Array.isArray(raw.unlockedAction)
    ? raw.unlockedAction
    : typeof raw.unlockedAction === "string"
      ? raw.unlockedAction
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const rawTechniques = Array.isArray(raw.techniques)
    ? raw.techniques
    : typeof raw.techniques === "string"
      ? raw.techniques
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return {
    ...raw,
    unlockedActions: rawActions
      .map((name: string) => actionsByName[name])
      .filter(Boolean) as Action[],
    techniques: rawTechniques
      .map((name: string) => actionsByName[name])
      .filter(Boolean) as Action[],
    level: Number(raw.level),
    repeatable: Boolean(raw.repeatable),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.speeds),
    techniquesLearned: Number(raw.techniquesLearned),
    quickAccessSlots: Number(raw.quickAccessSlots),
    focusPoints: Number(raw.focusPoints),
  };
});

export default generalFeats;
