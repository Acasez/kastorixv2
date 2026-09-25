import { type ChoiceDetail, type ChoiceItem } from "./ChoiceModal";
import type { ModalRequest } from "./modalTypes";
import backgrounds from "../../JSON/backgrounds.json";
import generalFeats from "../../JSON/general_feats.json";
import arcaneFeats from "../../JSON/arcane_feats.json";
import advantages from "../../JSON/advantages.json";
import ancestryFeats from "../../JSON/ancestry_feats.json";
import golemUpgrades from "../../JSON/golem_upgrades.json";
import runegunUpgrades from "../../JSON/runegun_upgrades.json";
import spells from "../../JSON/spells.json";
import weapons from "../../JSON/weapons.json";
import species from "../../JSON/species.json";
import metamagics from "../../JSON/metamagic.json";
import armors from "../../JSON/armors.json";
import { getActionIcons } from "../../utils/actionUtils";

export type ChoiceData = Record<
  Exclude<ModalRequest["type"], "baseStats">,
  ChoiceItem[]
>;

export type ChoiceType = Exclude<ModalRequest["type"], "baseStats">;

export type DetailField = {
  label: string;
  valueKey: string;
  italicFirstLine?: boolean;
};

function createDetails(
  item: Record<string, unknown>,
  fields: DetailField[],
): ChoiceDetail[] {
  return fields.flatMap(({ label, valueKey, italicFirstLine }) => {
    const value = item[valueKey];
    if (value === undefined || value === null || String(value).trim() === "") {
      return [];
    }

    return [{ label, value: String(value), italicFirstLine }];
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

const SPELL_FIELDS: DetailField[] = [
  { label: "Actions", valueKey: "actions" },
  { label: "Aspects", valueKey: "aspects" },
  { label: "Traits", valueKey: "traits" },
  { label: "Range", valueKey: "range" },
  { label: "Target", valueKey: "target" },
  { label: "Duration", valueKey: "duration" },
  { label: "Effect", valueKey: "effect", italicFirstLine: true },
  { label: "Upcast", valueKey: "upcast" },
  { label: "Rank", valueKey: "rank" },
];

const GENERAL_FEAT_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description", italicFirstLine: true },
  { label: "Prerequisites", valueKey: "prerequisites" },
  { label: "Level", valueKey: "level" },
];

const ARCANE_FEAT_FIELDS: DetailField[] = [
  ...GENERAL_FEAT_FIELDS,
  { label: "Choice", valueKey: "choice" },
];

const ADVANTAGE_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description" },
  { label: "Level", valueKey: "level" },
  { label: "Choice", valueKey: "choice" },
];

const ANCESTRY_FEAT_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description", italicFirstLine: true },
  { label: "Type", valueKey: "type" },
  { label: "Species", valueKey: "species" },
  { label: "Prerequisites", valueKey: "prerequisites" },
  { label: "Level", valueKey: "level" },
];

const UPGRADE_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description" },
  { label: "Prerequisites", valueKey: "prerequisites" },
  { label: "Level", valueKey: "level" },
];

const BACKGROUND_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description" },
  { label: "Granted Feat", valueKey: "generalFeat" },
];

const WEAPON_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description" },
  { label: "Damage", valueKey: "dice" },
  { label: "Damage Type", valueKey: "damageType" },
  { label: "Hands", valueKey: "hands" },
  { label: "Range", valueKey: "range" },
  { label: "Traits", valueKey: "traits" },
  { label: "Price", valueKey: "price" },
  { label: "Type", valueKey: "type" },
  { label: "Weapon Group", valueKey: "weaponGroup" },
];

const METAMAGIC_FIELDS: DetailField[] = [
  { label: "Spell Type", valueKey: "spellType" },
  { label: "Effect", valueKey: "effect" },
  { label: "DC increase", valueKey: "dc" },
];

const ARMOR_FIELDS: DetailField[] = [
  { label: "Resistances", valueKey: "resistances" },
  { label: "Weak Point Difficulty", valueKey: "weakPointDiff" },
  { label: "Armor Penalties", valueKey: "penalties" },
  { label: "Mana Recovery", valueKey: "manaRecovery" },
  { label: "Description", valueKey: "description" },
  { label: "Price", valueKey: "price" },
  { label: "Type", valueKey: "type" },
  { label: "Phy Required", valueKey: "phy" },
];

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
  const spellItems: ChoiceItem[] = (
    request.type === "spell" && request.rank
      ? spells.filter((spell) => spell.rank.endsWith(` ${request.rank}`))
      : spells
  ).map((spell) => ({
    ...createChoiceItems([spell], SPELL_FIELDS)[0],
    aspects: spell.aspects,
    traits: spell.traits,
    actionIcons: getActionIcons(spell.actions),
  }));

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
    unlockedAction: speciesItem.unlockedAction,
  }));

  const generalFeatItems = createChoiceItems(generalFeats, GENERAL_FEAT_FIELDS);
  const arcaneFeatItems = createChoiceItems(arcaneFeats, ARCANE_FEAT_FIELDS);
  const advantageItems = createChoiceItems(advantages, ADVANTAGE_FIELDS);
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
  const availableWeapons =
    request.type === "weapon" && request.excludedTypes
      ? weapons.filter(
          (weapon) => !request.excludedTypes?.includes(weapon.type),
        )
      : weapons;
  const weaponItems = createChoiceItems(availableWeapons, WEAPON_FIELDS);
  const metamagicItems = createChoiceItems(metamagics, METAMAGIC_FIELDS);
  const armorItems = createChoiceItems(armors, ARMOR_FIELDS);

  return {
    species: speciesItems,
    background: backgroundItems,
    generalFeat: generalFeatItems,
    arcaneFeat: arcaneFeatItems,
    advantage: advantageItems,
    ancestryFeat: ancestryFeatItems,
    golemUpgrade: golemUpgradeItems,
    runegunUpgrade: runegunUpgradeItems,
    spell: spellItems,
    weapon: weaponItems,
    metamagic: metamagicItems,
    armor: armorItems,
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
