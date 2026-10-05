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

export const useCharacterStore = create<CharacterState>((set, get) => ({
  character: defaultCharacter,

  setCharacter: (character) =>
    set({
      character: {
        ...character,
        speeds: getCharacterSpeeds(character),
        resistances: getCharacterResistances(character),
      },
    }),

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
}));
