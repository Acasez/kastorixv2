import rawConditions from "../JSON/conditions.json";
import type {
  Condition,
  ConditionNeutrality,
  ConditionTypes,
} from "../types/Condition";

export const conditions: Condition[] = rawConditions.map((raw) => {
  return {
    ...raw,
    level: 0,
    type: raw.type as ConditionTypes,
    neutrality: raw.neutrality as ConditionNeutrality,
  };
});

export default conditions;
