import type { Action } from "../types/Action";
import type { ArcaneFeat } from "../types/Feats";
import { actionsByName } from "./actions";
import rawArcaneFeats from "../JSON/arcane_feats.json";

export const arcaneFeats: ArcaneFeat[] = rawArcaneFeats.map((raw) => {
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
    repeatable: Boolean(raw.repeatable),
  };
});
