import type { Action } from "./Action";

export type RunegunUpgrades = {
  name: string;
  description: string;
  unlockedActions: Action[];
  prerequisites: string;
  level: number;
};

export type ArmorUpgrades = {
  name: string;
  description: string;
  prerequisites: string;
  level: number;
};
