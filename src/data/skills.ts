// data/skills.ts
import type { Skill } from "../types/Skills";
import type { StatKey } from "../types/StatKey";
import rawSkills from "../JSON/skills.json";
import type { ArmorType } from "../types/Armor";
import { lookup } from "../utils/lookupTypes";

export const skills: Skill[] = rawSkills.map((raw) => ({
  ...raw,
  stat: raw.stat as StatKey,
  armorPenalties: raw.armorPenalties as ArmorType,
}));

export const skillsByName: Record<string, Skill> = Object.fromEntries(
  skills.map((s) => [s.name, s]),
);

export const lookupSkills = (raw?: string | string[] | null) =>
  lookup(skillsByName, raw);
export default skills;
