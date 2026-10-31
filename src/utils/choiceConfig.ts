// In a new file: utils/choiceConfig.ts
import advantages from "../data/advantages";
import ancestryFeats from "../data/ancestryFeats";
import arcaneFeats from "../data/arcaneFeats";
import armors from "../data/armors";
import backgrounds from "../data/backgrounds";
import gadgets from "../data/gadgets";
import generalFeats from "../data/generalFeats";
import golemUpgrades from "../data/golemUpgrades";
import metamagics from "../data/metamagics";
import runegunUpgrades from "../data/runegunUpgrades";
import spells from "../data/spells";
import weapons from "../data/weapons";
import type { ChoiceType, GeneralFeat, Unlock } from "../types/Feats";

type UnlockableItem = {
  name: string;
  unlockedFeats?: Unlock[];
  generalFeat?: GeneralFeat | null;
  choice?: string;
};
export const choiceConfig: Record<
  ChoiceType,
  { title: string; items: UnlockableItem[] }
> = {
  background: { title: "Select Background", items: backgrounds },
  generalFeat: { title: "Select General Feat", items: generalFeats },
  arcaneFeat: { title: "Select Arcane Feat", items: arcaneFeats },
  advantage: { title: "Select Advantage", items: advantages },
  ancestryFeat: { title: "Select Ancestry Feat", items: ancestryFeats },
  golemUpgrade: { title: "Select Golem Upgrade", items: golemUpgrades },
  runegunUpgrade: { title: "Select Runegun Upgrade", items: runegunUpgrades },
  spell: { title: "Select Spell", items: spells },
  weapon: { title: "Select Weapon", items: weapons },
  metamagic: { title: "Select Metamagic", items: metamagics },
  armor: { title: "Select Armor", items: armors },
  gadget: { title: "Select Gadget", items: gadgets },
};
