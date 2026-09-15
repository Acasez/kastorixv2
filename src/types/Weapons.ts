import type { Action } from "./Action";
import type { DamageType } from "./DamageTypes";

export type Weapon = {
  name: string;
  dice: string;
  damageType: DamageType;
  hands: number;
  range: number;
  traits: WeaponTrait[];
  description: string;
  price: number;
  type: WeaponType;
  group: WeaponGroup;
};

export type WeaponTrait = {
  name: string;
  effect: string;
  specialAction: Action;
  type: string;
  modifiable: string;
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
