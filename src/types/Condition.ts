export type Condition = {
  name: string;
  effect: string;
  type: ConditionTypes;
  disappears: string;
  neutrality: ConditionNeutrality;
  level: number;
};

export type ConditionTypes = "Binary" | "Numeric";

export type ConditionNeutrality = "Negative" | "Positive" | "Neutral";
