import type { DetailField } from "../components/ModalViews/choiceData";

export const SPELL_FIELDS: DetailField[] = [
  { label: "", valueKey: "flavor", flavor: true },
  { label: "Actions", valueKey: "actions" },
  { label: "Trigger", valueKey: "trigger" },
  { label: "Aspects", valueKey: "aspects" },
  { label: "Traits", valueKey: "traits" },
  { label: "Range", valueKey: "range" },
  { label: "Target", valueKey: "target" },
  { label: "Duration", valueKey: "duration" },
  { label: "Effect", valueKey: "effect" },
  { label: "Upcast", valueKey: "upcast" },
  { label: "Rank", valueKey: "rank" },
];

export const GENERAL_FEAT_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description", italicFirstLine: true },
  { label: "Prerequisites", valueKey: "prerequisites" },
  { label: "Level", valueKey: "level" },
];

export const ARCANE_FEAT_FIELDS: DetailField[] = [...GENERAL_FEAT_FIELDS];

export const ADVANTAGE_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description" },
  { label: "Level", valueKey: "level" },
];

export const GOLEM_MODEL_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description" },
  { label: "PHY", valueKey: "phy" },
  { label: "DEX", valueKey: "dex" },
  { label: "INT", valueKey: "int" },
  { label: "WIL", valueKey: "wil" },
  { label: "Resistances", valueKey: "resistances" },
  { label: "Speeds", valueKey: "speeds" },
  { label: "Skills", valueKey: "skills" },
  { label: "Saves", valueKey: "saves" },
  { label: "Weapons", valueKey: "weapons" },
];

export const ASPECT_FIELDS: DetailField[] = [
  { label: "Type", valueKey: "type" },
  { label: "Opposite", valueKey: "opposite" },
  { label: "Basic Magic", valueKey: "basicMagic" },
  { label: "Aura", valueKey: "aura" },
  { label: "Infusion", valueKey: "infusion" },
  { label: "Elementalization", valueKey: "elementalization" },
];

export const ANCESTRY_FEAT_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description", italicFirstLine: true },
  { label: "Type", valueKey: "type" },
  { label: "Species", valueKey: "species" },
  { label: "Prerequisites", valueKey: "prerequisites" },
  { label: "Level", valueKey: "level" },
];

export const UPGRADE_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description" },
  { label: "Prerequisites", valueKey: "prerequisites" },
  { label: "Level", valueKey: "level" },
];

export const BACKGROUND_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description" },
  { label: "Granted Feat", valueKey: "generalFeat" },
];

export const WEAPON_FIELDS: DetailField[] = [
  { label: "Description", valueKey: "description" },
  {
    label: "Damage",
    valueKey: "dice",
  } /* ${formatDamageInstances(weapon.dice)} */,
  { label: "Hands", valueKey: "hands" },
  { label: "Range", valueKey: "range" },
  { label: "Traits", valueKey: "traits" },
  { label: "Price", valueKey: "price" },
  { label: "Type", valueKey: "type" },
  { label: "Weapon Group", valueKey: "weaponGroup" },
];

export const METAMAGIC_FIELDS: DetailField[] = [
  { label: "Spell Type", valueKey: "spellType" },
  { label: "Effect", valueKey: "effect" },
  { label: "DC increase", valueKey: "dc" },
];

export const ARMOR_FIELDS: DetailField[] = [
  { label: "Resistances", valueKey: "resistances" },
  { label: "Weak Point Difficulty", valueKey: "weakPointDiff" },
  { label: "Armor Penalties", valueKey: "penalties" },
  { label: "Mana Recovery", valueKey: "manaRecovery" },
  { label: "Description", valueKey: "description" },
  { label: "Price", valueKey: "price" },
  { label: "Type", valueKey: "type" },
  { label: "Phy Required", valueKey: "phy" },
];

export const GADGET_FIELDS: DetailField[] = [
  { label: "Type", valueKey: "type" },
  { label: "Level", valueKey: "level" },
  { label: "Requirement", valueKey: "requirement" },
  { label: "Effect", valueKey: "effect" },
];
