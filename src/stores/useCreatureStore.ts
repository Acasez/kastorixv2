// src/stores/useCreatureStore.ts
import { create } from "zustand";
import type { ProficiencyTierName } from "../constants/Proficiency";
import type { CreatureActionCost } from "../types/Action";
import type { StatKey } from "../types/StatKey";
import type { SpeedTypes } from "../types/SpeedTypes";
import type { SomaticComponent, VerbalComponent } from "../types/Spells";
import type { Weapon } from "../types/Weapons";

export type CreatureSaveKey = "Fortitude" | "Reflex" | "Will";
export type CreatureTrack = { current: number; max: number };

export type CreatureAction = {
  id: string;
  name: string;
  actions: CreatureActionCost;
  stat: StatKey;
  proficiency: ProficiencyTierName;
  manaCost: number;
  cooldown: string;
  trigger: string;
  requirement: string;
  description: string;
  traits: string;
};

export type CreaturePassive = {
  id: string;
  name: string;
  effect: string;
  traits: string;
};

export type Creature = {
  name: string;
  traits: string;
  skills: Partial<Record<string, ProficiencyTierName>>;
  languages: string;
  size: string;
  stats: Record<"PHY" | "DEX" | "INT" | "WIL", number>;
  health: CreatureTrack;
  aura: CreatureTrack;
  mana: CreatureTrack;
  savingThrows: Record<CreatureSaveKey, ProficiencyTierName>;
  armor: string;
  resistances: Partial<Record<string, number>>;
  speeds: Partial<Record<SpeedTypes, number>>;
  strikesProficiencies: Partial<Record<string, ProficiencyTierName>>;
  spellProficiencies: Partial<Record<string, ProficiencyTierName>>;
  customWeapons: Weapon[];
  spellShaping: { verbal: VerbalComponent; somatic: SomaticComponent };
  actions: CreatureAction[];
  spells: string[];
  strikes: string[];
  passives: CreaturePassive[];
};

type MultiCreatureStore = {
  creatures: Record<number, Creature>;
  getCreature: (blockId: number) => Creature;
  setCreature: (blockId: number, creature: Creature) => void;
  updateCreature: (blockId: number, patch: Partial<Creature>) => void;
  resetCreature: (blockId: number) => void;
  removeCreature: (blockId: number) => void;
};

const defaultCreature: Creature = {
  name: "",
  traits: "",
  skills: {},
  languages: "",
  size: "Medium",
  stats: { PHY: 0, DEX: 0, INT: 0, WIL: 0 },
  health: { current: 10, max: 10 },
  aura: { current: 10, max: 10 },
  mana: { current: 10, max: 10 },
  savingThrows: {
    Fortitude: "Untrained",
    Reflex: "Untrained",
    Will: "Untrained",
  },
  armor: "",
  resistances: {},
  speeds: { Land: 5 },
  strikesProficiencies: {},
  customWeapons: [],
  spellProficiencies: {},
  spellShaping: { verbal: "Standard", somatic: "Two Handed" },
  actions: [],
  spells: [],
  strikes: [],
  passives: [],
};

export const useCreatureStore = create<MultiCreatureStore>((set, get) => ({
  creatures: {},

  getCreature: (blockId) => {
    // Initialize if doesn't exist
    if (!get().creatures[blockId]) {
      get().resetCreature(blockId);
    }
    return get().creatures[blockId];
  },

  setCreature: (blockId, creature) =>
    set({ creatures: { ...get().creatures, [blockId]: creature } }),

  updateCreature: (blockId, patch) =>
    set({
      creatures: {
        ...get().creatures,
        [blockId]: { ...get().creatures[blockId], ...patch },
      },
    }),

  resetCreature: (blockId) =>
    set({
      creatures: {
        ...get().creatures,
        [blockId]: { ...defaultCreature },
      },
    }),

  removeCreature: (blockId) => {
    const newCreatures = { ...get().creatures };
    delete newCreatures[blockId];
    set({ creatures: newCreatures });
  },
}));
