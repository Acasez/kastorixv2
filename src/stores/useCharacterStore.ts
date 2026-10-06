// src/stores/useCharacterStore.ts
import { create } from "zustand";
import type { ProficiencyTierName } from "../constants/Proficiency";
import type { StatKey } from "../types/StatKey";
import type { SpeedTypes } from "../types/SpeedTypes";
import type { Spellshaping } from "../types/Spells";
import {
  getCharacterResistances,
  getCharacterSpeeds,
} from "../utils/characterResistances";
import { devtools } from "zustand/middleware";

export type Track = { current: number; max: number };

export type Character = {
  name: string;
  level: number;
  generalFeats: string[];
  arcaneFeats: string[];
  advantages: string[];
  ancestryFeats: string[];
  knownSpells: string[];
  metamagics: string[];
  weapons: string[];
  gadgets: string[];
  golemModel: string | null;
  golemWeapons: string[];
  golemWeaponGroups: string[];
  golemHealth: Track;
  armor: string;
  selections: Record<string, string>;
  background: string | null;
  species: string | null;
  baseStats: Record<StatKey, number>;
  baseStatsSet: boolean;
  skillProficiencies: Record<string, ProficiencyTierName>;
  loreSkills: string[];
  saveProficiencies: Record<string, ProficiencyTierName>;
  health: Track;
  aura: Track;
  mana: Track;
  manaDensity: string;
  speeds: Record<SpeedTypes, number>;
  resistances: Record<string, number>;
  spellShaping: Spellshaping;
  gold: number;
  inventory: string;
  quickAccessSlots: number;
  quickAccessItems: string[];
};

type CharacterState = {
  character: Character;
  setCharacter: (character: Character) => void;
  resetCharacter: () => void;
  updateCharacter: (patch: Partial<Character>) => void;
  handleLevelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGoldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInventoryChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  saveCharacter: (name: string) => void;
  loadCharacter: (name: string) => void;
  exportCharacter: () => string;
  importCharacter: (fileContent: string) => void;
};

const defaultCharacter: Character = {
  name: "",
  level: 1,
  generalFeats: [],
  arcaneFeats: [],
  advantages: [],
  ancestryFeats: [],
  knownSpells: [],
  metamagics: [],
  weapons: [],
  gadgets: [],
  golemModel: null,
  golemWeapons: [],
  golemWeaponGroups: [],
  golemHealth: { current: 10, max: 10 },
  armor: "",
  selections: {},
  background: null,
  species: null,
  baseStats: { PHY: 0, DEX: 0, INT: 0, WIL: 0 },
  baseStatsSet: false,
  skillProficiencies: {},
  loreSkills: [],
  saveProficiencies: {},
  health: { current: 10, max: 10 },
  aura: { current: 10, max: 10 },
  mana: { current: 10, max: 10 },
  manaDensity: "Normal",
  speeds: { Land: 5, Swim: 0, Climb: 0, Burrow: 0, Glide: 0, Fly: 0 },
  resistances: {},
  spellShaping: { verbal: "Standard", somatic: "Two Handed", totalBonus: "" },
  gold: 0,
  inventory: "",
  quickAccessSlots: 3,
  quickAccessItems: ["", "", ""],
};

function isCharacter(value: unknown): value is Character {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { name?: unknown }).name === "string"
  );
}

// Merge logic moved from SaveLoadButtons
function mergeCharacter(current: Character, saved: Character): Character {
  const legacyGolemCrafterKey = Object.entries(saved.selections ?? {}).find(
    ([key, value]) =>
      key.startsWith("advantage:") &&
      !key.endsWith(":choice") &&
      value === "Golemcrafter",
  )?.[0];

  return {
    ...current,
    ...saved,
    golemWeapons: saved.golemWeapons ?? current.golemWeapons,
    golemWeaponGroups: saved.golemWeaponGroups ?? current.golemWeaponGroups,
    golemModel:
      saved.golemModel ??
      (legacyGolemCrafterKey
        ? (saved.selections[`${legacyGolemCrafterKey}:choice`] ?? null)
        : null),
    baseStats: { ...current.baseStats, ...saved.baseStats },
    health: { ...current.health, ...saved.health },
    golemHealth: { ...current.golemHealth, ...saved.golemHealth },
    aura: { ...current.aura, ...saved.aura },
    mana: { ...current.mana, ...saved.mana },
    speeds: { ...current.speeds, ...saved.speeds },
    spellShaping: { ...current.spellShaping, ...saved.spellShaping },
  };
}

export const useCharacterStore = create<CharacterState>()(
  devtools(
    (set, get) => ({
      character: defaultCharacter,

      setCharacter: (
        characterOrFn: Character | ((prev: Character) => Character),
      ) => {
        const newCharacter =
          typeof characterOrFn === "function"
            ? characterOrFn(get().character)
            : characterOrFn;
        set({
          character: {
            ...newCharacter,
            speeds: getCharacterSpeeds(newCharacter),
            resistances: getCharacterResistances(newCharacter),
          },
        });
      },

      resetCharacter: () => set({ character: defaultCharacter }),

      updateCharacter: (patch) => {
        const updated = { ...get().character, ...patch };
        set({
          character: {
            ...updated,
            speeds: getCharacterSpeeds(updated),
            resistances: getCharacterResistances(updated),
          },
        });
      },

      saveCharacter: (name: string) => {
        const characterKey = name.trim();
        if (!characterKey) {
          window.alert("Enter a character name before saving.");
          return;
        }
        localStorage.setItem(characterKey, JSON.stringify(get().character));
        window.alert(`Saved character "${characterKey}".`);
      },

      loadCharacter: (name: string) => {
        const characterKey = name.trim();
        if (!characterKey) {
          window.alert("Enter a character name before loading.");
          return;
        }

        const savedCharacter = localStorage.getItem(characterKey);
        if (!savedCharacter) {
          window.alert(`No saved character found for "${characterKey}".`);
          return;
        }

        try {
          const savedData: unknown = JSON.parse(savedCharacter);
          if (!isCharacter(savedData)) {
            throw new Error("Invalid character format");
          }
          // ✅ Inline the setCharacter logic
          const merged = mergeCharacter(get().character, savedData);
          set({
            character: {
              ...merged,
              speeds: getCharacterSpeeds(merged),
              resistances: getCharacterResistances(merged),
            },
          });
        } catch {
          window.alert(`Saved character "${characterKey}" is invalid.`);
        }
      },

      exportCharacter: () => {
        return JSON.stringify(get().character, null, 2);
      },

      importCharacter: (fileContent: string) => {
        try {
          const importedCharacter: unknown = JSON.parse(fileContent);
          if (!isCharacter(importedCharacter)) {
            throw new Error("Invalid character format");
          }
          const merged = mergeCharacter(get().character, importedCharacter);
          set({
            character: {
              ...merged,
              speeds: getCharacterSpeeds(merged),
              resistances: getCharacterResistances(merged),
            },
          });
        } catch {
          window.alert("The selected file is not a valid character JSON file.");
        }
      },

      handleLevelChange: (e) =>
        get().updateCharacter({
          level: Math.min(20, Math.max(0, Number(e.target.value))),
        }),

      handleNameChange: (e) => get().updateCharacter({ name: e.target.value }),

      handleGoldChange: (e) =>
        get().updateCharacter({
          gold: Math.min(99999, Math.max(0, Number(e.target.value))),
        }),

      handleInventoryChange: (e) =>
        get().updateCharacter({ inventory: e.target.value }),
    }),
    { name: "CharacterStore" }, // This name appears in DevTools
  ),
);
