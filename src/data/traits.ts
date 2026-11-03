// data/weaponTraits.ts
import rawTraits from "../JSON/traits.json";
import type { StatKey } from "../types/StatKey";
import type { RawTrait, Trait } from "../types/Trait";
import { lookup } from "../utils/lookupTypes";
import { actionsByName } from "./actions";

function parseTrait(raw: RawTrait): Trait {
  const match = raw.name.match(/^([\w\s]+)(?:\s*\(([^)]+)\))?$/);
  const baseName = match ? match[1].trim() : raw.name;
  const parameter = match ? match[2]?.trim() : undefined;

  return {
    name: baseName,
    parameter,
    flavor: raw.flavor,
    effect: raw.effect,
    specialAction: raw.specialAction
      ? actionsByName[raw.specialAction] || null
      : null,
    type: raw.type,
    modifiable: raw.modifiable,
    attackStat: raw.attackStat ? (raw.attackStat as StatKey | "DEX/PHY") : null,
    damageStat: raw.damageStat ? (raw.damageStat as StatKey | "None") : null,
    MAPChange: raw.MAPChange ? Number(raw.MAPChange) : null,
    spellshapingDCChange: raw.spellshapingDCChange,
  };
}

export const traits: Trait[] = rawTraits.map((raw) =>
  parseTrait(raw as unknown as RawTrait),
);
export const traitsByName: Record<string, Trait> = Object.fromEntries(
  traits.map((t) => [t.name, t]),
);

export const lookupTrait = (raw?: string | string[] | null) =>
  lookup(traitsByName, raw);

export default traits;
