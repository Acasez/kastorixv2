import type { ChoiceType, Unlock } from "../types/Feats";

const STRING_TO_UNLOCK: Record<string, ChoiceType> = {
  "General Feat": "generalFeat",
  "Arcane Feat": "arcaneFeat",
  "Golem Upgrade": "golemUpgrade",
  "Runegun Upgrade": "runegunUpgrade",
  Advantage: "advantage",
  "Ancestry Feat": "ancestryFeat",
  Background: "background",
};

export function parseUnlocks(input: string): Unlock[] {
  return input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part): Unlock => {
      const segments = part.split(/\s+-\s+/);
      const type = STRING_TO_UNLOCK[segments[0]];
      if (!type)
        throw new Error(`Unknown feat type: "${segments[0]}" in "${part}"`);

      // Extract and normalize the level part
      const levelSegment = segments[1]
        ?.replace(/^Level\s+/i, "")
        ?.toUpperCase();
      // Handle "X" as a special variable level
      let level: number | "X";
      if (levelSegment === "X") {
        level = "X";
      } else {
        const numLevel = Number(levelSegment);
        if (!Number.isFinite(numLevel)) {
          throw new Error(`Invalid level in "${part}"`);
        }
        level = numLevel;
      }
      const preset = segments.slice(2).join(" - ");
      return preset ? { type, level, preset } : { type, level };
    });
}
