import type { CreatureSizes } from "../constants/CreatureSizes";

export type Species = {
  name: string;
  size: CreatureSizes;
  health: number;
  mana: number;
  traitOne: string;
  traitOneDesc: string;
  traitTwo: string;
  traitTwoDesc: string;
  traitThree: string;
  traitThreeDesc: string;
  traitFour: string;
  traitFourDesc: string;
  unlockedFeats: string;
  spellsLearned: string;
  speeds: string;
  resistances: string;
  gadgets: string;
};
