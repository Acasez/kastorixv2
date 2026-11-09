// src/components/ModalViews/handlers/factory.ts
import type { ModalHandler } from "./types";
import type { Character } from "../../../stores/useCharacterStore";
import type { ModalRequest } from "../modalTypes";
import {
  getUnlockedActionNames,
  getUnlockedTechniques,
} from "../../../utils/selectionUtils";
import { createGolemFromModel } from "./createGolem";

/**
 * Helper to safely get selectionKey from request
 * Returns undefined for types that don't have selectionKey (like species)
 */
function getSelectionKey(request: ModalRequest): string | undefined {
  return "selectionKey" in request ? request.selectionKey : undefined;
}

/**
 * Mapping between collection types and their configuration
 */
type CollectionTypeMap = {
  spell: { replaceKey: "replaceSpell"; collectionKey: "knownSpells" };
  weapon: { replaceKey: "replaceWeapon"; collectionKey: "weapons" };
  gadget: { replaceKey: "replaceGadget"; collectionKey: "gadgets" };
  metamagic: { replaceKey: "replaceMetamagic"; collectionKey: "metamagics" };
  technique: {
    replaceKey: "replaceTechnique";
    collectionKey: "unlockedActions";
  };
};

type CollectionTypes = keyof CollectionTypeMap;

const collectionTypeMap = {
  spell: { replaceKey: "replaceSpell", collectionKey: "knownSpells" },
  weapon: { replaceKey: "replaceWeapon", collectionKey: "weapons" },
  gadget: { replaceKey: "replaceGadget", collectionKey: "gadgets" },
  metamagic: { replaceKey: "replaceMetamagic", collectionKey: "metamagics" },
  technique: {
    replaceKey: "replaceTechnique",
    collectionKey: "unlockedActions",
  },
} satisfies CollectionTypeMap;

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

      const items: { name: string; repeatable?: boolean }[] = [];
      const choiceNames = new Set(items.map((item) => item.name));
      const ownedNames = new Set<string>();

      Object.entries(character.selections).forEach(([key, selectedValue]) => {
        if (typeof selectedValue !== "string") return;

        const isSameTypeSelection = key.startsWith(`${type}:`);
        const isNestedChoice = choiceNames.has(selectedValue);

        if (key !== selectionKey && (isSameTypeSelection || isNestedChoice)) {
          ownedNames.add(selectedValue);
        }
      });

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

      const unlockedActionNames = chosenItem
        ? getUnlockedActionNames(chosenItem)
        : [];
      const unlockedTechniques = chosenItem
        ? getUnlockedTechniques(chosenItem)
        : [];
      const newActions: string[] =
        unlockedActionNames.concat(unlockedTechniques);

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

      if (type === "species" && character[propertyKey] !== chosenItem.name) {
        updates.selections = Object.fromEntries(
          Object.entries(character.selections).filter(
            ([key]) => !key.startsWith("species:unlocked:"),
          ),
        );
      }

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
 * Fully type-safe with no 'any' casts
 */
export function createCollectionHandler<T extends CollectionTypes>(
  type: T,
): ModalHandler {
  // Get config for this specific collection type
  const config = {
    replaceKey: collectionTypeMap[type].replaceKey,
    collectionKey: collectionTypeMap[type].collectionKey,
  } as const;

  // Extract the specific request type for this collection
  type RequestType = Extract<ModalRequest, { type: T }>;

  return {
    getCurrentValue: (_character, request) => {
      if (request.type !== type) return null;
      const req = request as RequestType;
      // Safe indexed access - TypeScript knows this is valid
      return (
        (req[config.replaceKey as keyof RequestType] as string | undefined) ??
        null
      );
    },

    getBlockedChoices: (character, request) => {
      if (request.type !== type) return [];

      const req = request as RequestType;
      const collection = character[config.collectionKey] as string[];

      if (!Array.isArray(collection)) return [];

      // Safe indexed access
      const replaceValue = req[config.replaceKey as keyof RequestType] as
        | string
        | undefined;
      return replaceValue
        ? collection.filter((name) => name !== replaceValue)
        : collection;
    },

    onConfirm: (character, updateCharacter, request, chosenItem) => {
      if (request.type !== type) return;

      const req = request as RequestType;
      const collection = character[config.collectionKey] as string[];
      // Safe indexed access
      const replaceValue = req[config.replaceKey as keyof RequestType] as
        | string
        | undefined;

      const filteredCollection = replaceValue
        ? collection.filter((name) => name !== replaceValue)
        : collection;

      const updatedCollection = filteredCollection.includes(chosenItem.name)
        ? filteredCollection
        : [...filteredCollection, chosenItem.name];

      updateCharacter({
        [config.collectionKey]: updatedCollection,
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
    onConfirm: () => {},
  };
}
