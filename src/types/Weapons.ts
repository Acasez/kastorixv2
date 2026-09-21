import type { Action } from "./Action";
import type { DamageType } from "./DamageTypes";

export type Weapon = {
  name: string;
  dice: string;
  damageType: string;
  hands: string;
  range: string;
  traits: string;
  description: string;
  price: string;
  type: string;
  weaponGroup: string;
};

export type WeaponTyped = {
  name: string;
  dice: string;
  damageType: DamageType;
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
