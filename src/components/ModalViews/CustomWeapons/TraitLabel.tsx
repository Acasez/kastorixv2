import type { Trait } from "../../../types/Trait";

export const traitLabel = (trait: Trait) =>
  trait.parameter ? `${trait.name} (${trait.parameter})` : trait.name;
