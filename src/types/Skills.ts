import type { ArmorType } from "./Armor";
import type { StatKey } from "./StatKey";

export interface Skill {
  name: string;
  stat: StatKey;
  armorPenalties: ArmorType;
  description: string;
}
