//utils/selectionUtils.ts
import type { Character } from "../stores/useCharacterStore";
import type { ChoiceType } from "../types/Feats";
import generalFeats from "../data/generalFeats";
import arcaneFeats from "../data/arcaneFeats";
import advantages from "../data/advantages";
import ancestryFeats from "../data/ancestryFeats";
import golemUpgrades from "../data/golemUpgrades";
import runegunUpgrades from "..//data/runegunUpgrades";
import backgrounds from "..//data/backgrounds";
import spells from "../data/spells";
import weapons from "../data/weapons";
import metamagics from "../data/metamagics";
import armors from "../data/armors";
import gadgets from "../data/gadgets";
import type { Action } from "../types/Action";
import { techniques } from "../data/actions";

// Type for items that can have unlocked actions
export type UnlockableItem = {
  repeatable?: boolean;
  name: string;
  unlockedActions?: Action[];
  techniques?: Action[];
};

export function getUnlockedActionNames(item: UnlockableItem): string[] {
  return item.unlockedActions?.map((a) => a.name) ?? [];
}

export function getUnlockedTechniques(item: UnlockableItem): string[] {
  return item.techniques?.map((a) => a.name) ?? [];
}

// Mapping from ChoiceType to data array
export const typeToData: Record<ChoiceType, UnlockableItem[]> = {
  generalFeat: generalFeats,
  arcaneFeat: arcaneFeats,
  advantage: advantages,
  ancestryFeat: ancestryFeats,
  golemUpgrade: golemUpgrades,
  runegunUpgrade: runegunUpgrades,
  background: backgrounds,
  spell: spells,
  weapon: weapons,
  metamagic: metamagics,
  armor: armors,
  gadget: gadgets,
  technique: techniques,
};

/**
 * Gets the current selection for a given type and key
 */
export function getCurrentSelection(
  character: Character,
  selectionKey: string,
): string | null {
  return character.selections[selectionKey] ?? null;
}

/**
 * Clears a selection and its children
 */
export function clearSelection(
  character: Character,
  selectionKey: string,
  type: ChoiceType,
): Partial<Character> {
  const selections = Object.fromEntries(
    Object.entries(character.selections).filter(
      ([key]) =>
        key !== selectionKey &&
        key !== `${selectionKey}:choice` &&
        !key.startsWith(`${selectionKey}:unlocked:`),
    ),
  );

  return {
    selections,
    // Special cases
    ...(type === "advantage" &&
    character.selections[selectionKey] === "Golemcrafter"
      ? { golem: null }
      : {}),
    ...(type === "background" ? { background: null } : {}),
  };
}
