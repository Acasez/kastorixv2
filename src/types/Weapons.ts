import type { DamageInstance } from "./DamageTypes";
import type { Price } from "./Item";
import type { Trait } from "./Trait";

export type Weapon = {
  name: string;
  dice: DamageInstance[];
  hands: number;
  range: number;
  traits: Trait[];
  description: string;
  price?: Price;
  type: WeaponType;
  weaponGroup: WeaponGroup;
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
