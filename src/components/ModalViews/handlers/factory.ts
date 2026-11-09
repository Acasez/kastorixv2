// src/components/ModalViews/handlers/factory.ts
import type { ModalHandler } from "./types";
import type { Character } from "../../../stores/useCharacterStore";
import type { ModalRequest } from "../modalTypes";
import {
  getUnlockedActionNames,
  getUnlockedTechniques,
} from "../../../utils/selectionUtils";
import { createGolemFromModel } from "./createGolem";

type CollectionTypes =
  | "spell"
  | "weapon"
  | "gadget"
  | "metamagic"
  | "technique";

type ReplaceKeyMap = {
  spell: "replaceSpell";
  weapon: "replaceWeapon";
  gadget: "replaceGadget";
  metamagic: "replaceMetamagic";
  technique: "replaceTechnique";
};

/**
 * Helper to safely get selectionKey from request
 * Returns undefined for types that don't have selectionKey (like species)
 */
function getSelectionKey(request: ModalRequest): string | undefined {
  return "selectionKey" in request ? request.selectionKey : undefined;
}

/**
 * Creates a handler for simple selections that store values in character.selections
 * Used for: generalFeat, arcaneFeat, advantage, ancestryFeat, golemUpgrade, runegunUpgrade
 */
export function createSelectionHandler(
  type: ModalRequest["type"],
): ModalHandler {
  return {
    getCurrentValue: (character, request) => {
      if (request.type !== type) return null;
      const selectionKey = getSelectionKey(request);
      if (!selectionKey) return null;
      return character.selections[selectionKey] ?? null;
    },

    getBlockedChoices: (character, request) => {
      if (request.type !== type) return [];

      const selectionKey = getSelectionKey(request);
      if (!selectionKey) return [];

      // Get items from request or use empty array as fallback
      // Note: Items are now passed via getChoiceData in ModalWrapper
      const items: { name: string; repeatable?: boolean }[] = [];
      const choiceNames = new Set(items.map((item) => item.name));
      const ownedNames = new Set<string>();

      // Find all owned items of this type
      Object.entries(character.selections).forEach(([key, selectedValue]) => {
        if (typeof selectedValue !== "string") return;

        const isSameTypeSelection = key.startsWith(`${type}:`);
        const isNestedChoice = choiceNames.has(selectedValue);

        if (key !== selectionKey && (isSameTypeSelection || isNestedChoice)) {
          ownedNames.add(selectedValue);
        }
      });

      // Filter out repeatable items
      return items
        .filter((item) => {
          const repeatableValue = item.repeatable;
          const isRepeatable = repeatableValue === true;
          return ownedNames.has(item.name) && !isRepeatable;
        })
        .map((item) => item.name);
    },

    onConfirm: (character, updateCharacter, request, chosenItem, choice) => {
      if (request.type !== type) return;

      const selectionKey = getSelectionKey(request);
      if (!selectionKey) return;

      const choiceKey = `${selectionKey}:choice`;
      const selections = Object.fromEntries(
        Object.entries(character.selections).filter(
          ([key]) => key !== choiceKey,
        ),
      );

      // Get unlocked actions and techniques
      const unlockedActionNames = chosenItem
        ? getUnlockedActionNames(chosenItem)
        : [];
      const unlockedTechniques = chosenItem
        ? getUnlockedTechniques(chosenItem)
        : [];
      const newActions: string[] =
        unlockedActionNames.concat(unlockedTechniques);

      // Special handling for Golemcrafter
      const golemUpdate: Partial<Character> = {};
      if (
        type === "advantage" &&
        chosenItem.name === "Golemcrafter" &&
        choice
      ) {
        const golem = createGolemFromModel(choice);
        if (golem) {
          golemUpdate.golem = golem;
        }
      }

      const requestLevel = "level" in request ? request.level : 0;

      updateCharacter({
        selections: {
          ...selections,
          [selectionKey]: chosenItem.name,
          ...(choice ? { [choiceKey]: choice } : {}),
        },
        selectionLevels: {
          ...character.selectionLevels,
          [selectionKey]: requestLevel,
        },
        ...golemUpdate,
        unlockedActions: [
          ...new Set([...character.unlockedActions, ...newActions]),
        ],
      });
    },
  };
}

/**
 * Creates a handler for character properties (species, background, armor)
 * Used for: species, background, armor
 */
export function createPropertyHandler<T extends keyof Character>(
  type: ModalRequest["type"],
  propertyKey: T,
): ModalHandler {
  return {
    getCurrentValue: (character, request) => {
      if (request.type !== type) return null;
      return character[propertyKey] as string | null;
    },

    getBlockedChoices: () => [],

    onConfirm: (character, updateCharacter, request, chosenItem) => {
      if (request.type !== type) return;

      const updates: Partial<Character> = {
        [propertyKey]: chosenItem.name,
      };

      // Special handling for species - clear species-specific selections
      if (type === "species" && character[propertyKey] !== chosenItem.name) {
        updates.selections = Object.fromEntries(
          Object.entries(character.selections).filter(
            ([key]) => !key.startsWith("species:unlocked:"),
          ),
        );
      }

      // Special handling for background
      if (type === "background" && "selectionKey" in request) {
        updates.selections = {
          ...character.selections,
          [request.selectionKey]: chosenItem.name,
        };
      }

      updateCharacter(updates);
    },
  };
}
/**
 * Creates a handler for collection-based selections (spells, gadgets, weapons, etc.)
 * Used for: spell, weapon, gadget, metamagic, technique
 */
export function createCollectionHandler<T extends CollectionTypes>(
  type: T,
  config: {
    collectionKey: keyof Character;
    replaceKey: ReplaceKeyMap[T];
  },
): ModalHandler {
  const { collectionKey, replaceKey } = config;

  return {
    getCurrentValue: (character, request) => {
      if (request.type !== type) return null;
      return (
        (request as Record<string, string | undefined>)[replaceKey] ?? null
      );
    },

    getBlockedChoices: (character, request) => {
      if (request.type !== type) return [];

      const collection = character[collectionKey] as string[];
      if (!Array.isArray(collection)) return [];

      const replaceValue = (request as Record<string, string | undefined>)[
        replaceKey
      ];
      return collection.filter((name) => name !== replaceValue);
    },

    onConfirm: (character, updateCharacter, request, chosenItem) => {
      if (request.type !== type) return;

      const collection = character[collectionKey] as string[];
      const replaceValue = (request as Record<string, string | undefined>)[
        replaceKey
      ];

      const filteredCollection = replaceValue
        ? collection.filter((name) => name !== replaceValue)
        : collection;

      const updatedCollection = filteredCollection.includes(chosenItem.name)
        ? filteredCollection
        : [...filteredCollection, chosenItem.name];

      updateCharacter({
        [collectionKey]: updatedCollection,
      });
    },
  };
}

/**
 * Creates a handler for special cases (baseStats, statIncrease)
 * These are handled by their own components, so the handler is minimal
 */
export function createSpecialHandler(type: ModalRequest["type"]): ModalHandler {
  void type;

  return {
    getCurrentValue: () => null,
    getBlockedChoices: () => [],
    onConfirm: () => {}, // Handled by the component itself
  };
}
