import { useCallback, useState, type ReactNode } from "react";
import { CreatureContext, type Creature } from "./CreatureContext";

const defaultCreature: Creature = {
  name: "",
  traits: "",
  senses: "",
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
  strikes: {},
  spellProficiencies: {},
  actions: "",
  spells: [],
  passives: "",
};

export function CreatureProvider({ children }: { children: ReactNode }) {
  const [creature, setCreature] = useState<Creature>(() => ({
    ...defaultCreature,
    stats: { ...defaultCreature.stats },
    health: { ...defaultCreature.health },
    aura: { ...defaultCreature.aura },
    mana: { ...defaultCreature.mana },
    savingThrows: { ...defaultCreature.savingThrows },
    skills: { ...defaultCreature.skills },
    resistances: { ...defaultCreature.resistances },
    speeds: { ...defaultCreature.speeds },
    strikes: { ...defaultCreature.strikes },
    spellProficiencies: { ...defaultCreature.spellProficiencies },
    spells: [...defaultCreature.spells],
  }));

  const updateCreature = useCallback(
    (patch: Partial<Creature>) =>
      setCreature((previous) => ({ ...previous, ...patch })),
    [],
  );

  return (
    <CreatureContext.Provider value={{ creature, setCreature, updateCreature }}>
      {children}
    </CreatureContext.Provider>
  );
}
