export type Action = {
  name: string;
  actions: ActionCost;
  trigger: string;
  requirement: string;
  description: string;
  traits: ActionTrait[];
};

export type ActionCost = "0" | "1" | "2" | "3" | "R";

export type ActionTrait = {
  name: string;
  effect: string;
};
