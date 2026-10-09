import type { Action } from "./Action";
import type { DamageInstance } from "./DamageTypes";
import type { StatKey } from "./StatKey";

export type Weapon = {
  name: string;
  dice: DamageInstance[];
  hands: number;
  range: number;
  traits: WeaponTrait[];
  description: string;
  price: number;
  type: WeaponType;
  weaponGroup: WeaponGroup;
};

export type WeaponTrait = {
  name: string;
  parameter?: string;
  effect: string;
  specialAction: Action | null;
  type: string;
  modifiable: string;
  attackStat: StatKey | "DEX/PHY" | null;
  damageStat: StatKey | "None" | null;
  MAPChange: number | null;
};

export type RawWeaponTrait = {
  name: string;
  effect: string;
  specialAction: string;
  type: string;
  modifiable: string;
  attackStat: string;
  damageStat: string;
  MAPChange: string;
};

export type WeaponType =
  | "Unarmed"
  | "Simple"
  | "Martial"
  | "Advanced"
  | "Golem"
  | "Artificer";

export type WeaponGroup =
  | "Axe"
  | "Bow"
  | "Club"
  | "Crossbow"
  | "Flail"
  | "Hammer"
  | "Knife"
  | "Polearm"
  | "Runegun"
  | "Shield"
  | "Sling"
  | "Spear"
  | "Staff"
  | "Sword"
  | "Unarmed";
