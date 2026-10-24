// data/actions.ts
import type {
  Action,
  ActionCost,
  ActionTrait,
  TechniqueRank,
} from "../types/Action";
import rawActions from "../JSON/actions.json";
import type { Skill } from "../types/Skills";
import { toNumber } from "../utils/toNumber";

export const actions: Action[] = rawActions.map((raw) => ({
  ...raw,
  manaCost: toNumber(raw.manaCost),
  focusCost: toNumber(raw.focusCost),
  skill: raw.skill as unknown as Skill[],
  actions: raw.actions as ActionCost,
  traits: raw.traits as unknown as ActionTrait[],
  techniqueRank: raw.actions as TechniqueRank,
}));

export default actions;

export const actionsByName: Record<string, Action> = Object.fromEntries(
  actions.map((a) => [a.name, a]),
);
