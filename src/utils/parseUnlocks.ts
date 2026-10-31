import type { FeatTypes, Unlock } from "../types/Feats";

const FEAT_TYPES: FeatTypes[] = [
  "generalFeat",
  "arcaneFeat",
  "golemUpgrade",
  "runegunUpgrade",
  "advantage",
  "ancestryFeat",
];

export function parseUnlocks(input: string): Unlock[] {
  return input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part): Unlock => {
      const segments = part.split(/\s+-\s+/);
      const type = segments[0] as FeatTypes;
      if (!FEAT_TYPES.includes(type)) {
        throw new Error(`Unknown feat type: "${type}" in "${part}"`);
      }
      const level = Number(segments[1]?.replace(/^Level\s+/i, ""));
      if (!Number.isFinite(level)) {
        throw new Error(`Invalid level in "${part}"`);
      }
      const preset = segments.slice(2).join(" - ");
      return preset ? { type, level, preset } : { type, level };
    });
}
