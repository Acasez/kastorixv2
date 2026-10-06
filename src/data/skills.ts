// data/skills.ts
import type { Skill } from "../types/Skills";
import type { StatKey } from "../types/StatKey";
import rawSkills from "../JSON/skills.json";

export const skills: Skill[] = rawSkills.map((raw) => ({
  ...raw,
  stat: raw.stat as StatKey,
}));

export default skills;
