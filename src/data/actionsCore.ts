import rawActions from "../JSON/actions.json";
import { toNumber } from "../utils/toNumber";
import { lookupSkills } from "./skills";
import type { ActionCore, ActionCost, TechniqueRank } from "../types/Action";

export const actions: ActionCore[] = rawActions.map((raw) => ({
  ...raw,
  manaCost: toNumber(raw.manaCost),
  focusCost: toNumber(raw.focusCost),
  skill: lookupSkills(raw.skill),
  actions: raw.actions as ActionCost,
  traitNames: raw.traits,
  techniqueRank: (raw.techniqueRank ?? raw.actions) as TechniqueRank,
}));

export const actionsByName: Record<string, ActionCore> = Object.fromEntries(
  actions.map((a) => [a.name, a]),
);
