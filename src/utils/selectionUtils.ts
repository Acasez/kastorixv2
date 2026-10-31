//utils/selectionUtils.ts
import type { Character } from "../stores/useCharacterStore";
import type { ChoiceType } from "../types/Feats";

/**
 * Gets the current selection for a given type and key
 */
export function getCurrentSelection(
  character: Character,
  type: ChoiceType,
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
/* 
  const clearSelection = (selectionKey: string, type: ChoiceType) => {
    const selectedItem = choiceConfig[type].items.find(
      (item) => item.name === character.selections[selectionKey],
    );
    const selections = Object.fromEntries(
      Object.entries(character.selections).filter(
        ([key]) =>
          key !== selectionKey &&
          key !== `${selectionKey}:choice` &&
          !key.startsWith(`${selectionKey}:unlocked:`),
      ),
    );

    updateCharacter({
      selections,
      ...(type === "advantage" &&
      selectedItem?.choice === "Golem Model - Choice"
        ? { golem: null }
        : {}),
      ...(type === "background" ? { background: null } : {}),
    });
  };
 */
