import type { WeaponTrait } from "../../../types/Weapons";

export const traitLabel = (trait: WeaponTrait) =>
  trait.parameter ? `${trait.name} (${trait.parameter})` : trait.name;
