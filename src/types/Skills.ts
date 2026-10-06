import type { StatKey } from "./StatKey";

export interface Skill {
  name: string;
  stat: StatKey;
  armorPenalties: string;
  description: string;
}
