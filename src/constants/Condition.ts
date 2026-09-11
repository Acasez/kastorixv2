export type Condition = {
  name: string; // single-letter display: "U", "T", ...
  effect: string;
  type: ConditionTypes;
  disappears: string;
  neutrality: ConditionNeutrality;
};

export type ConditionTypes = "Binary" | "Numeric";

export type ConditionNeutrality = "Negative" | "Positive" | "Neutral";
