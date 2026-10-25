// src/components/ModalViews/handlers/index.ts
import type { Character } from "../../../stores/useCharacterStore";
import type { ModalRequest } from "../modalTypes";
import backgrounds from "../../../JSON/backgrounds.json";
import { getChoiceData } from "../choiceData";
import type { FeatTypes } from "../../../types/Feats";

// Define the handler type
type UpdateFn = (updates: Partial<Character>) => void;

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
    value: string,
    choice?: string,
  ) => void;
}

// ============================================
// HANDLER REGISTRY
// ============================================
export const handlers: Record<ModalRequest["type"], ModalHandler> = {
  species: createSpeciesHandler(),
  background: createBackgroundHandler(),
  generalFeat: createSelectionHandler("generalFeat"),
  arcaneFeat: createSelectionHandler("arcaneFeat"),
  advantage: createSelectionHandler("advantage"),
  ancestryFeat: createAncestryFeatHandler(),
  golemUpgrade: createSelectionHandler("golemUpgrade"),
  runegunUpgrade: createSelectionHandler("runegunUpgrade"),
  spell: createSpellHandler(),
  weapon: createWeaponHandler(),
  gadget: createGadgetHandler(),
  metamagic: createMetamagicHandler(),
  armor: createArmorHandler(),
  baseStats: createBaseStatsHandler(),
  statIncrease: createStatIncreaseHandler(),
};

// ============================================
// FACTORY: Selection-based handlers (generalFeat, arcaneFeat, golemUpgrade, runegunUpgrade)
// ============================================
function createSelectionHandler(
  type: Extract<ModalRequest["type"], FeatTypes>,
): ModalHandler {
  return {
    getCurrentValue: (character, request) => {
      if (request.type !== type) return null;
      return character.selections[request.selectionKey] ?? null;
    },

    getBlockedChoices: (character, request) => {
      if (request.type !== type) return [];

      const choiceData = getChoiceData(request);
      const choiceNames = new Set(
        choiceData[request.type].map((item) => item.name),
      );
      const ownedNames = new Set<string>();

      Object.entries(character.selections).forEach(([key, selectedValue]) => {
        if (typeof selectedValue !== "string") return;

        const isSameTypeSelection = key.startsWith(`${type}:`);
        const isNestedChoice = choiceNames.has(selectedValue);

        if (
          key !== request.selectionKey &&
          (isSameTypeSelection || isNestedChoice)
        ) {
          ownedNames.add(selectedValue);
        }
      });

      return choiceData[request.type]
        .filter((item) => {
          const repeatableValue = item.repeatable;
          const isRepeatable =
            repeatableValue === true ||
            repeatableValue === 1 ||
            repeatableValue === "1";
          return ownedNames.has(item.name) && !isRepeatable;
        })
        .map((item) => item.name);
    },

    onConfirm: (character, updateCharacter, request, value, choice) => {
      if (request.type !== type) return;

      const choiceKey = `${request.selectionKey}:choice`;
      const selections = Object.fromEntries(
        Object.entries(character.selections).filter(
          ([key]) => key !== choiceKey,
        ),
      );

      updateCharacter({
        selections: {
          ...selections,
          [request.selectionKey]: value,
          ...(choice ? { [choiceKey]: choice } : {}),
        },
      });
    },
  };
}

// ============================================
// HANDLER: Species
// ============================================
function createSpeciesHandler(): ModalHandler {
  return {
    getCurrentValue: (character, request) => {
      if (request.type !== "species") return null;
      return character.species;
    },

    getBlockedChoices: () => [],

    onConfirm: (character, updateCharacter, request, value) => {
      if (request.type !== "species") return;

      const selections =
        character.species === value
          ? character.selections
          : Object.fromEntries(
              Object.entries(character.selections).filter(
                ([key]) => !key.startsWith("species:unlocked:"),
              ),
            );

      updateCharacter({ species: value, selections });
    },
  };
}

// ============================================
// HANDLER: Background
// ============================================
function createBackgroundHandler(): ModalHandler {
  return {
    getCurrentValue: (character, request) => {
      if (request.type !== "background") return null;
      return character.background;
    },

    getBlockedChoices: () => [],

    onConfirm: (character, updateCharacter, request, value) => {
      if (request.type !== "background") return;

      const selectedBackground = backgrounds.find((bg) => bg.name === value);
      const backgroundFeatKey = `${request.selectionKey}:unlocked:0`;

      updateCharacter({
        background: value,
        selections: {
          ...character.selections,
          [request.selectionKey]: value,
          ...(selectedBackground?.generalFeat
            ? { [backgroundFeatKey]: selectedBackground.generalFeat }
            : {}),
        },
      });
    },
  };
}

// ============================================
// HANDLER: Ancestry Feat (needs species filter)
// ============================================
function createAncestryFeatHandler(): ModalHandler {
  return {
    getCurrentValue: (character, request) => {
      if (request.type !== "ancestryFeat") return null;
      return character.selections[request.selectionKey] ?? null;
    },

    getBlockedChoices: (character, request) => {
      if (request.type !== "ancestryFeat") return [];

      const choiceData = getChoiceData(request);
      const choiceNames = new Set(
        choiceData.ancestryFeat.map((item) => item.name),
      );
      const ownedNames = new Set<string>();

      Object.entries(character.selections).forEach(([key, selectedValue]) => {
        if (typeof selectedValue !== "string") return;
        const isSameTypeSelection = key.startsWith("ancestryFeat:");
        const isNestedChoice = choiceNames.has(selectedValue);
        if (
          key !== request.selectionKey &&
          (isSameTypeSelection || isNestedChoice)
        ) {
          ownedNames.add(selectedValue);
        }
      });

      return choiceData.ancestryFeat
        .filter((item) => {
          const repeatableValue = item.repeatable;
          const isRepeatable =
            repeatableValue === true ||
            repeatableValue === 1 ||
            repeatableValue === "1";
          return ownedNames.has(item.name) && !isRepeatable;
        })
        .map((item) => item.name);
    },

    onConfirm: (character, updateCharacter, request, value, choice) => {
      if (request.type !== "ancestryFeat") return;

      const choiceKey = `${request.selectionKey}:choice`;
      const selections = Object.fromEntries(
        Object.entries(character.selections).filter(
          ([key]) => key !== choiceKey,
        ),
      );

      updateCharacter({
        selections: {
          ...selections,
          [request.selectionKey]: value,
          ...(choice ? { [choiceKey]: choice } : {}),
        },
      });
    },
  };
}

// ============================================
// HANDLER: Spell
// ============================================
function createSpellHandler(): ModalHandler {
  return {
    getCurrentValue: (_character, request) => {
      if (request.type !== "spell" || !request.rank) return null;
      return request.replaceSpell ?? null;
    },

    getBlockedChoices: (character, request) => {
      if (request.type !== "spell" || !request.rank) return [];
      return character.knownSpells.filter(
        (spellName) => spellName !== request.replaceSpell,
      );
    },

    onConfirm: (character, updateCharacter, request, value) => {
      if (request.type !== "spell" || !request.rank) return;

      const knownSpells = character.knownSpells.filter(
        (spellName) => spellName !== request.replaceSpell,
      );

      updateCharacter({
        knownSpells: knownSpells.includes(value)
          ? knownSpells
          : [...knownSpells, value],
      });
    },
  };
}

// ============================================
// HANDLER: Weapon
// ============================================
function createWeaponHandler(): ModalHandler {
  return {
    getCurrentValue: (_character, request) => {
      if (request.type !== "weapon") return null;
      return request.replaceWeapon ?? null;
    },

    getBlockedChoices: (character, request) => {
      if (request.type !== "weapon") return [];
      const ownedWeapons =
        request.owner === "golem" ? character.golemWeapons : character.weapons;
      return ownedWeapons.filter(
        (weaponName) => weaponName !== request.replaceWeapon,
      );
    },

    onConfirm: (character, updateCharacter, request, value) => {
      if (request.type !== "weapon") return;

      const currentWeapons =
        request.owner === "golem" ? character.golemWeapons : character.weapons;
      const weapons = currentWeapons.filter(
        (weaponName) => weaponName !== request.replaceWeapon,
      );

      const isGolem = request.owner === "golem";
      const updatedWeapons = weapons.includes(value)
        ? weapons
        : [...weapons, value];

      updateCharacter(
        isGolem
          ? { golemWeapons: updatedWeapons }
          : { weapons: updatedWeapons },
      );
    },
  };
}

// ============================================
// HANDLER: Gadget
// ============================================
function createGadgetHandler(): ModalHandler {
  return {
    getCurrentValue: (_character, request) => {
      if (request.type !== "gadget") return null;
      return request.replaceGadget ?? null;
    },

    getBlockedChoices: (character, request) => {
      if (request.type !== "gadget") return [];
      return character.gadgets.filter(
        (gadgetName) => gadgetName !== request.replaceGadget,
      );
    },

    onConfirm: (character, updateCharacter, request, value) => {
      if (request.type !== "gadget") return;

      const gadgets = character.gadgets.filter(
        (gadgetName) => gadgetName !== request.replaceGadget,
      );
      updateCharacter({
        gadgets: gadgets.includes(value) ? gadgets : [...gadgets, value],
      });
    },
  };
}

// ============================================
// HANDLER: Metamagic
// ============================================
function createMetamagicHandler(): ModalHandler {
  return {
    getCurrentValue: (_character, request) => {
      if (request.type !== "metamagic") return null;
      return request.replaceMetamagic ?? null;
    },

    getBlockedChoices: (character, request) => {
      if (request.type !== "metamagic") return [];
      return character.metamagics.filter(
        (name) => name !== request.replaceMetamagic,
      );
    },

    onConfirm: (character, updateCharacter, request, value) => {
      if (request.type !== "metamagic") return;

      const metamagics = character.metamagics.filter(
        (name) => name !== request.replaceMetamagic,
      );
      updateCharacter({
        metamagics: metamagics.includes(value)
          ? metamagics
          : [...metamagics, value],
      });
    },
  };
}

// ============================================
// HANDLER: Armor
// ============================================
function createArmorHandler(): ModalHandler {
  return {
    getCurrentValue: (character, request) => {
      if (request.type !== "armor") return null;
      return character.armor;
    },

    getBlockedChoices: () => [],

    onConfirm: (_character, updateCharacter, request, value) => {
      if (request.type !== "armor") return;
      updateCharacter({ armor: value });
    },
  };
}

// ============================================
// HANDLER: Base Stats
// ============================================
function createBaseStatsHandler(): ModalHandler {
  return {
    getCurrentValue: () => null,
    getBlockedChoices: () => [],
    onConfirm: () => {}, // Handled by BaseStatsEditor component
  };
}

// ============================================
// HANDLER: Stat Increase
// ============================================
function createStatIncreaseHandler(): ModalHandler {
  return {
    getCurrentValue: () => null,
    getBlockedChoices: () => [],
    onConfirm: () => {}, // Handled by StatIncreaseModal component
  };
}
