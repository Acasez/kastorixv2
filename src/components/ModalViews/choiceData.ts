import { type ChoiceItem } from "./ChoiceModal";
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
import { getActionIcons } from "../../utils/actionUtils";

export type ChoiceData = Record<
  Exclude<ModalRequest["type"], "baseStats">,
  ChoiceItem[]
>;

function createDetails(
  entries: Array<[label: string, value: unknown]>,
): { label: string; value: string }[] {
  return entries.flatMap(([label, value]) => {
    if (value === undefined || value === null || String(value).trim() === "") {
      return [];
    }

    return [{ label, value: String(value) }];
  });
}

export function getChoiceData(request: ModalRequest): ChoiceData {
  const spellItems: ChoiceItem[] = (
    request.type === "spell" && request.rank
      ? spells.filter((spell) => spell.rank.endsWith(` ${request.rank}`))
      : spells
  ).map((spell) => ({
    ...spell,
    aspects: spell.aspects,
    traits: spell.traits,
    details: createDetails([
      ["Actions", spell.actions],
      ["Aspects", spell.aspects],
      ["Traits", spell.traits],
      ["Range", spell.range],
      ["Target", spell.target],
      ["Duration", spell.duration],
      ["Effect", spell.effect],
      ["Upcast", spell.upcast],
      ["Rank", spell.rank],
    ]),
    actionIcons: getActionIcons(spell.actions),
  }));

  const speciesItems: ChoiceItem[] = species.map((speciesItem) => ({
    name: speciesItem.name,
    details: createDetails([
      ["Size", speciesItem.size],
      ["Starting Health", speciesItem.health],
      ["Starting Mana", speciesItem.mana],
      ...[
        [speciesItem.traitOne, speciesItem.traitOneDesc],
        [speciesItem.traitTwo, speciesItem.traitTwoDesc],
        [speciesItem.traitThree, speciesItem.traitThreeDesc],
        [speciesItem.traitFour, speciesItem.traitFourDesc],
      ].map(
        ([traitName, traitDescription]) =>
          [String(traitName), traitDescription] as [string, unknown],
      ),
    ]),
    unlockedAction: speciesItem.unlockedAction,
  }));

  const generalFeatItems: ChoiceItem[] = generalFeats.map((featItem) => ({
    ...featItem,
    details: createDetails([
      ["Description", featItem.description],
      ["Prerequisites", featItem.prerequisites],
      ["Level", featItem.level],
    ]),
  }));

  const arcaneFeatItems: ChoiceItem[] = arcaneFeats.map((featItem) => ({
    ...featItem,
    details: createDetails([
      ["Description", featItem.description],
      ["Prerequisites", featItem.prerequisites],
      ["Level", featItem.level],
      ["Choice", featItem.choice],
    ]),
  }));

  const advantageItems: ChoiceItem[] = advantages.map((item) => ({
    ...item,
    details: createDetails([
      ["Description", item.description],
      ["Level", item.level],
      ["Choice", item.choice],
    ]),
  }));

  const ancestryFeatItems: ChoiceItem[] = ancestryFeats.map((item) => ({
    ...item,
    details: createDetails([
      ["Description", item.description],
      ["Type", item.type],
      ["Species", item.species],
      ["Prerequisites", item.prerequisites],
      ["Level", item.level],
    ]),
  }));

  const golemUpgradeItems: ChoiceItem[] = golemUpgrades.map((item) => ({
    ...item,
    details: createDetails([
      ["Description", item.description],
      ["Prerequisites", item.prerequisites],
      ["Level", item.level],
    ]),
  }));

  const runegunUpgradeItems: ChoiceItem[] = runegunUpgrades.map((item) => ({
    ...item,
    details: createDetails([
      ["Description", item.description],
      ["Prerequisites", item.prerequisites],
      ["Level", item.level],
    ]),
  }));

  const backgroundItems: ChoiceItem[] = backgrounds.map((item) => ({
    ...item,
    details: createDetails([
      ["Description", item.description],
      ["Granted Feat", item.generalFeat],
    ]),
  }));

  const weaponItems: ChoiceItem[] = weapons.map((item) => ({
    ...item,
    details: createDetails([
      ["Description", item.description],
      ["Damage", item.dice],
      ["Damage Type", item.damageType],
      ["Hands", item.hands],
      ["Range", item.range],
      ["Traits", item.traits],
      ["Price", item.price],
      ["Type", item.type],
      ["Weapon Group", item.weaponGroup],
    ]),
  }));

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
  };
}
