import type { Character } from "../contexts/CharacterContext";
import type { StatKey } from "./StatKey";

// constants/proficiency.ts
export type ProficiencyTierName =
  | "Untrained"
  | "Trained"
  | "Expert"
  | "Master"
  | "Legendary";

export type Proficiency = {
  name: string; // single-letter display: "U", "T", ...
  bonus: number;
  fullName: ProficiencyTierName;
  color: string;
};

export const PROFICIENCY_LEVELS: Proficiency[] = [
  { name: "U", bonus: 0, fullName: "Untrained", color: "#cccccc" },
  { name: "T", bonus: 2, fullName: "Trained", color: "#47d147" },
  { name: "E", bonus: 4, fullName: "Expert", color: "#66b3ff" },
  { name: "M", bonus: 6, fullName: "Master", color: "#cc66ff" },
  { name: "L", bonus: 8, fullName: "Legendary", color: "#ff9966" },
];

export function getProficiency(name: string): Proficiency {
  const level = PROFICIENCY_LEVELS.find((p) => p.fullName === name);
  if (!level) {
    throw new Error(`Unknown proficiency tier: "${name}"`);
  }
  return level;
}

export function skillModifier(
  character: Character,
  skillName: string,
  stat: StatKey,
): number {
  const tier = getProficiency(
    character.skillProficiencies[skillName] ?? "Untrained",
  );
  return (character.baseStats[stat] ?? 0) + tier.bonus;
}
