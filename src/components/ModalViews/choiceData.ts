import { type ChoiceItem } from "./ChoiceModal";
import type { ModalRequest } from "./modalTypes";
import backgrounds from "../../data/backgrounds";
import generalFeats from "../../data/generalFeats";
import arcaneFeats from "../../data/arcaneFeats";
import advantages from "../../data/advantages";
import ancestryFeats from "../../data/ancestryFeats";
import golemUpgrades from "../../data/golemUpgrades";
import runegunUpgrades from "../../data/runegunUpgrades";
import spells from "../../data/spells";
import weapons from "../../data/weapons";
import species from "../../data/species";
import metamagics from "../../data/metamagics";
import armors from "../../data/armors";
import gadgets from "../../data/gadgets";
import golemModels from "../../data/golemModels";
import aspects from "../../data/aspects";
import { getActionIcons } from "../../utils/actionUtils";
import type { Weapon, WeaponTrait } from "../../types/Weapons";
import { formatDamageInstances } from "../../utils/damage";
import type { DamageInstance } from "../../types/DamageTypes";
import {
  ADVANTAGE_FIELDS,
  ANCESTRY_FEAT_FIELDS,
  ARCANE_FEAT_FIELDS,
  ARMOR_FIELDS,
  ASPECT_FIELDS,
  BACKGROUND_FIELDS,
  GADGET_FIELDS,
  GENERAL_FEAT_FIELDS,
  GOLEM_MODEL_FIELDS,
  METAMAGIC_FIELDS,
  SPELL_FIELDS,
  UPGRADE_FIELDS,
  WEAPON_FIELDS,
} from "../../constants/DetailFields";
import { formatPrice } from "../../utils/prices";
import type { Spell, SpellTrait } from "../../types/Spells";

export type ChoiceData = Record<
  Exclude<ModalRequest["type"], "baseStats" | "statIncrease">,
  ChoiceItem[]
>;

export type ChoiceType = Exclude<
  ModalRequest["type"],
  "baseStats" | "statIncrease"
>;

export type DetailField = {
  label: string;
  valueKey: string;
  italicFirstLine?: boolean;
  flavor?: boolean;
};

// Narrow arrays by checking every element, not just the first
function isArrayOf<T>(
  value: unknown,
  guard: (v: unknown) => v is T,
): value is T[] {
  return Array.isArray(value) && value.length > 0 && value.every(guard);
}

function isDamageInstance(v: unknown): v is DamageInstance {
  return typeof v === "object" && v !== null && "name" in v && "amount" in v;
}

function isWeaponTrait(v: unknown): v is WeaponTrait {
  return typeof v === "object" && v !== null && "name" in v && !("amount" in v);
}

function isSpellTrait(v: unknown): v is SpellTrait {
  return typeof v === "object" && v !== null && "name" in v && !("amount" in v);
}

function formatValue(value: unknown): string | null {
  if (isArrayOf(value, isDamageInstance)) {
    return formatDamageInstances(value);
  }

  if (isArrayOf(value, isWeaponTrait)) {
    return value
      .map((t) => (t.parameter ? `${t.name} (${t.parameter})` : t.name))
      .join(", ");
  }

  if (isArrayOf(value, isSpellTrait)) {
    return value.map((t) => `${t.name}`).join(", ");
  }

  if (Array.isArray(value)) {
    return value.map((v) => String(v)).join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return null;
  }
  return String(value);
}

function createDetails(
  item: Record<string, unknown>,
  fields: DetailField[],
): DetailField[] {
  return fields.flatMap(({ label, valueKey, italicFirstLine, flavor }) => {
    const value = item[valueKey];

    const displayValue =
      value === undefined || value === null || String(value).trim() === ""
        ? null
        : formatValue(value);

    if (displayValue === null || displayValue.trim() === "") {
      return [];
    }

    return [{ label, valueKey: displayValue, italicFirstLine, flavor }];
  });
}

function createChoiceItems<T extends { name: string }>(
  items: T[],
  fields: DetailField[],
): ChoiceItem[] {
  return items.map((item) => ({
    ...item,
    details: createDetails(item as Record<string, unknown>, fields),
  }));
}

export function getWeaponChoiceItems(
  excludedTypes: string[] = [],
  includedTypes?: string[],
  includedWeaponGroups?: string[],
): ChoiceItem[] {
  const availableWeapons = weapons.filter(
    (weapon) =>
      !excludedTypes.includes(weapon.type) &&
      (!includedTypes ||
        includedTypes.includes(weapon.type) ||
        includedWeaponGroups?.includes(weapon.weaponGroup)),
  );
  return createChoiceItems(availableWeapons, WEAPON_FIELDS);
}

export function getSpellChoiceItems(rank?: string): ChoiceItem[] {
  const availableSpells = rank
    ? spells.filter((spell) => spell.rank.endsWith(` ${rank}`))
    : spells;

  return availableSpells.map((spell) => ({
    ...createChoiceItems([spell], SPELL_FIELDS)[0],
    actionIcons: getActionIcons(spell.actions),
  }));
}

export function getArmorChoiceItems(): ChoiceItem[] {
  return createChoiceItems(armors, ARMOR_FIELDS);
}

function featIsAvailableForSpecies(
  featSpecies: string,
  selectedSpecies: string | null,
): boolean {
  if (!selectedSpecies) return false;

  return featSpecies
    .split(/[,/]/)
    .some((speciesName) => speciesName.trim() === selectedSpecies);
}

export function getChoiceData(request: ModalRequest): ChoiceData {
  const spellItems = getSpellChoiceItems(
    request.type === "spell" ? request.rank : undefined,
  );

  const speciesItems: ChoiceItem[] = species.map((speciesItem) => ({
    name: speciesItem.name,
    details: [
      ...createDetails(speciesItem, [
        { label: "Size", valueKey: "size" },
        { label: "Starting Health", valueKey: "health" },
        { label: "Starting Mana", valueKey: "mana" },
      ]),
      ...[
        [speciesItem.traitOne, speciesItem.traitOneDesc],
        [speciesItem.traitTwo, speciesItem.traitTwoDesc],
        [speciesItem.traitThree, speciesItem.traitThreeDesc],
        [speciesItem.traitFour, speciesItem.traitFourDesc],
      ].flatMap(([traitName, traitDescription]) => {
        if (!traitName) return [];
        return createDetails({ value: traitDescription }, [
          {
            label: String(traitName),
            valueKey: "value",
            italicFirstLine: true,
          },
        ]);
      }),
    ],
    unlockedAction: speciesItem.unlockedActions,
  }));

  const generalFeatItems = createChoiceItems(generalFeats, GENERAL_FEAT_FIELDS);
  const arcaneFeatItems = createChoiceItems(arcaneFeats, ARCANE_FEAT_FIELDS);
  const advantageItems = createChoiceItems(advantages, ADVANTAGE_FIELDS);
  const golemModelItems = createChoiceItems(golemModels, GOLEM_MODEL_FIELDS);
  const runegunModelItems = createChoiceItems(
    weapons.filter((weapon) => weapon.weaponGroup === "Runegun"),
    WEAPON_FIELDS,
  );
  const aspectChoiceItems = createChoiceItems(
    aspects.filter((aspect) => aspect.attuneable !== "No"),
    ASPECT_FIELDS,
  );
  const addChoiceOptions = (items: ChoiceItem[]) =>
    items.map((item) => {
      const choiceType = item.choice?.replace(/\s*-\s*Choice$/i, "");
      const choiceOptions =
        choiceType === "Golem Model"
          ? golemModelItems
          : choiceType === "Runegun Model"
            ? runegunModelItems
            : choiceType?.startsWith("Aspects - ")
              ? aspectChoiceItems
              : undefined;

      return choiceOptions ? { ...item, choiceOptions } : item;
    });
  const availableAncestryFeats =
    request.type === "ancestryFeat"
      ? ancestryFeats.filter((feat) =>
          featIsAvailableForSpecies(feat.species, request.species),
        )
      : ancestryFeats;
  const ancestryFeatItems = createChoiceItems(
    availableAncestryFeats,
    ANCESTRY_FEAT_FIELDS,
  );
  const golemUpgradeItems = createChoiceItems(golemUpgrades, UPGRADE_FIELDS);
  const runegunUpgradeItems = createChoiceItems(
    runegunUpgrades,
    UPGRADE_FIELDS,
  );
  const backgroundItems = createChoiceItems(backgrounds, BACKGROUND_FIELDS);
  const weaponItems = getWeaponChoiceItems(
    request.type === "weapon" ? request.excludedTypes : undefined,
    request.type === "weapon" ? request.includedTypes : undefined,
    request.type === "weapon" ? request.includedWeaponGroups : undefined,
  );
  const metamagicItems = createChoiceItems(metamagics, METAMAGIC_FIELDS);
  const armorItems = getArmorChoiceItems();
  const gadgetItems = createChoiceItems(gadgets, GADGET_FIELDS);

  return {
    species: speciesItems,
    background: backgroundItems,
    generalFeat: generalFeatItems,
    arcaneFeat: addChoiceOptions(arcaneFeatItems),
    advantage: addChoiceOptions(advantageItems),
    ancestryFeat: ancestryFeatItems,
    golemUpgrade: golemUpgradeItems,
    runegunUpgrade: runegunUpgradeItems,
    spell: spellItems,
    weapon: weaponItems,
    metamagic: metamagicItems,
    armor: armorItems,
    gadget: gadgetItems,
  };
}

export function getChoiceItem(
  type: ChoiceType,
  name: string,
): ChoiceItem | undefined {
  if (type === "ancestryFeat") {
    return createChoiceItems(ancestryFeats, ANCESTRY_FEAT_FIELDS).find(
      (item) => item.name === name,
    );
  }

  const request =
    type === "species"
      ? { type: "species" as const, title: "Select Species" }
      : {
          type,
          title: "",
          selectionKey: "",
          level: 0,
        };

  return getChoiceData(request)[type].find((item) => item.name === name);
}

export function weaponToChoiceItem(weapon: Weapon): ChoiceItem {
  const traits = weapon.traits
    .map((trait) =>
      trait.parameter ? `${trait.name} (${trait.parameter})` : trait.name,
    )
    .join(", ");

  return {
    name: weapon.name,
    traits,
    type: weapon.type,
    weaponGroup: weapon.weaponGroup,
    details: [
      { label: "Damage", valueKey: `${formatDamageInstances(weapon.dice)}` },
      { label: "Hands", valueKey: String(weapon.hands) },
      { label: "Range", valueKey: String(weapon.range) },
      { label: "Traits", valueKey: traits },
      { label: "Description", valueKey: weapon.description },
      { label: "Price", valueKey: `${formatPrice(weapon.price)}` },
      { label: "Type", valueKey: weapon.type },
      { label: "Weapon Group", valueKey: weapon.weaponGroup },
    ].filter(({ valueKey }) => valueKey.trim() !== ""),
  };
}
//Not really useful now, might be useful later
export function spellToChoiceItem(spell: Spell): ChoiceItem {
  const traits = spell.traits.map((trait) => trait.name).join(", ");

  const aspects = spell.aspects.map((aspect) => aspect.name).join(", ");

  return {
    name: spell.name,
    traits,
    aspects,
    details: [
      { label: "Actions", valueKey: String(spell.actions) },
      { label: "Aspects", valueKey: aspects },
      { label: "Traits", valueKey: traits },
      { label: "Range", valueKey: String(spell.range) },
      { label: "Duration", valueKey: spell.duration },
      { label: "Effect", valueKey: spell.effect },
      { label: "Rank", valueKey: spell.rank },
      { label: "Upcast", valueKey: spell.upcast },
    ].filter(({ valueKey }) => valueKey.trim() !== ""),
  };
}
