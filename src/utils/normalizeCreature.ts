import type {
  Creature,
  CreatureAction,
  CreaturePassive,
  CreatureTrack,
} from "../contexts/CreatureContext";
import type { ProficiencyTierName } from "../constants/Proficiency";
import type { VerbalComponent, SomaticComponent } from "../types/Spells";
import type { Weapon } from "../types/Weapons";

// If constants/Proficiency already exports the tier names, import that instead.
const PROFICIENCY_TIERS: readonly string[] = [
  "Untrained",
  "Trained",
  "Expert",
  "Master",
  "Legendary",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const str = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const num = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const tier = (value: unknown): ProficiencyTierName | undefined =>
  typeof value === "string" && PROFICIENCY_TIERS.includes(value)
    ? (value as ProficiencyTierName)
    : undefined;

const track = (value: unknown, fallback: CreatureTrack): CreatureTrack => {
  if (!isRecord(value)) return { ...fallback };
  const max = num(value.max, fallback.max);
  // A missing "current" falls back to "max" so tracks start full.
  return { current: num(value.current, max), max };
};

const tierRecord = (value: unknown): Record<string, ProficiencyTierName> => {
  if (!isRecord(value)) return {};
  const result: Record<string, ProficiencyTierName> = {};
  for (const [key, entry] of Object.entries(value)) {
    const t = tier(entry);
    if (t !== undefined) result[key] = t;
  }
  return result;
};

const numberRecord = (value: unknown): Record<string, number> => {
  if (!isRecord(value)) return {};
  const result: Record<string, number> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "number" && Number.isFinite(entry))
      result[key] = entry;
  }
  return result;
};

const stringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];

const actions = (value: unknown): CreatureAction[] =>
  Array.isArray(value)
    ? value.flatMap((entry) => {
        if (!isRecord(entry)) return [];
        return [
          {
            id: str(entry.id) || crypto.randomUUID(),
            name: str(entry.name),
            actions: str(
              entry.actions,
              "1 Action",
            ) as CreatureAction["actions"],
            stat: str(entry.stat, "PHY") as CreatureAction["stat"],
            proficiency: tier(entry.proficiency) ?? "Untrained",
            manaCost: num(entry.manaCost),
            cooldown: str(entry.cooldown),
            trigger: str(entry.trigger),
            requirement: str(entry.requirement),
            description: str(entry.description),
            traits: str(entry.traits),
          },
        ];
      })
    : [];

const passives = (value: unknown): CreaturePassive[] =>
  Array.isArray(value)
    ? value.flatMap((entry) => {
        if (!isRecord(entry)) return [];
        return [
          {
            id: str(entry.id) || crypto.randomUUID(),
            name: str(entry.name),
            effect: str(entry.effect),
            traits: str(entry.traits),
          },
        ];
      })
    : [];

const weapons = (value: unknown): Weapon[] =>
  Array.isArray(value)
    ? value.flatMap((entry) => {
        if (!isRecord(entry) || !str(entry.name).trim()) return [];
        return [
          {
            name: str(entry.name).trim(),
            dice: str(entry.dice),
            damageType: str(entry.damageType, "Piercing"),
            hands: str(entry.hands, "1"),
            range: str(entry.range, "1"),
            traits: str(entry.traits),
            description: str(entry.description),
            price: str(entry.price),
            type: str(entry.type, "Simple"),
            weaponGroup: str(entry.weaponGroup, "Unarmed"),
          },
        ];
      })
    : [];

export function normalizeCreature(input: unknown): Creature {
  const src = isRecord(input) ? input : {};
  const saves = isRecord(src.savingThrows) ? src.savingThrows : {};
  const shaping = isRecord(src.spellShaping) ? src.spellShaping : {};

  return {
    name: str(src.name),
    traits: str(src.traits),
    skills: tierRecord(src.skills),
    languages: str(src.languages),
    size: str(src.size, "Medium"),
    stats: {
      PHY: num(isRecord(src.stats) ? src.stats.PHY : undefined),
      DEX: num(isRecord(src.stats) ? src.stats.DEX : undefined),
      INT: num(isRecord(src.stats) ? src.stats.INT : undefined),
      WIL: num(isRecord(src.stats) ? src.stats.WIL : undefined),
    },
    health: track(src.health, { current: 10, max: 10 }),
    aura: track(src.aura, { current: 10, max: 10 }),
    mana: track(src.mana, { current: 10, max: 10 }),
    savingThrows: {
      Fortitude: tier(saves.Fortitude) ?? "Untrained",
      Reflex: tier(saves.Reflex) ?? "Untrained",
      Will: tier(saves.Will) ?? "Untrained",
    },
    armor: str(src.armor),
    resistances: numberRecord(src.resistances),
    speeds: numberRecord(src.speeds) as Creature["speeds"],
    strikesProficiencies: tierRecord(src.strikesProficiencies),
    customWeapons: weapons(src.customWeapons),
    spellProficiencies: tierRecord(src.spellProficiencies),
    spellShaping: {
      verbal: str(shaping.verbal, "Standard") as VerbalComponent,
      somatic: str(shaping.somatic, "Two Handed") as SomaticComponent,
    },
    actions: actions(src.actions),
    spells: stringArray(src.spells),
    strikes: stringArray(src.strikes),
    passives: passives(src.passives),
  };
}
