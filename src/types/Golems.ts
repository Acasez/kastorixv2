import type { Action } from "./Action";
import type { Resistance } from "./DamageTypes";
import type { Speed } from "./SpeedTypes";
import type { Weapon } from "./Weapons";

export type GolemModel = {
  name: string;
  description: string;
  phy: number;
  dex: number;
  int: number;
  wil: number;
  resistances: Resistance[];
  speeds: Speed[];
  featureOne: string;
  featureOneDesc: string;
  skills: string;
  saves: string;
  weaponsProfs: string;
  naturalWeapons: Weapon[];
};

export type GolemUpgrade = {
  name: string;
  description: string;
  prerequisites: string;
  level: number;
  golemWeapon: Weapon[];
  unlockedActions: Action[];
  healthBase: number;
  healthIncrease: string;
  resistances: Resistance[];
  speeds: Speed[];
  techniques: number;
};
