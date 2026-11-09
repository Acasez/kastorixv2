// src/components/ModalViews/handlers/types.ts
import type { Character } from "../../../stores/useCharacterStore";
import type { ModalRequest } from "../modalTypes";
import type { UnlockableItem } from "../../../utils/selectionUtils";

export type UpdateFn = (updates: Partial<Character>) => void;

export interface ModalHandler {
  getCurrentValue: (
    character: Character,
    request: ModalRequest,
  ) => string | null;
  getBlockedChoices: (character: Character, request: ModalRequest) => string[];
  onConfirm: (
    character: Character,
    updateCharacter: UpdateFn,
    request: ModalRequest,
    chosenItem: UnlockableItem,
    choice?: string,
  ) => void;
}
