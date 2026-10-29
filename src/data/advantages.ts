import type { Action } from "../types/Action";
import type { Advantage } from "../types/Feats";
import { actionsByName } from "./actions";
import rawAdvantages from "../JSON/advantages.json";
import { parseSpeeds, parseResistances } from "../utils/parseNamedUtils";

export const advantages: Advantage[] = rawAdvantages.map((raw) => {
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
    unlockedActions: rawActions
      .map((name: string) => actionsByName[name])
      .filter(Boolean) as Action[],
    level: Number(raw.level),
    speeds: parseSpeeds(raw.speeds),
    resistances: parseResistances(raw.speeds),
  };
});

export default advantages;
