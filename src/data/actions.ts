// data/actions.ts
import type { Action, ActionCost, ActionTrait } from "../types/Action";
import rawActions from "../JSON/actions.json";

export const actions: Action[] = rawActions.map((raw) => ({
  ...raw,
  actions: raw.actions as ActionCost,
  traits: raw.traits as unknown as ActionTrait[],
}));

export default actions;

export const actionsByName: Record<string, Action> = Object.fromEntries(
  actions.map((a) => [a.name, a]),
);
