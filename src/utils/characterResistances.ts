import armors from "../JSON/armors.json";
import ancestryFeats from "../JSON/ancestry_feats.json";
import advantages from "../JSON/advantages.json";
import damageTypes from "../JSON/damage_types.json";
import generalFeats from "../JSON/general_feats.json";
import species from "../JSON/species.json";
import type { SpeedTypes } from "../types/SpeedTypes";

type ResistanceSource = { name: string; resistances?: string };
type SpeedSource = { name: string; speeds?: string };

function addResistances(
  totals: Record<string, number>,
  resistanceText: string | undefined,
) {
  resistanceText?.split(",").forEach((resistance) => {
    const match = resistance.trim().match(/^\((\d+)\)\s+(.+)$/);
    if (!match) return;

    const [, value, type] = match;
    const damageNames = damageTypes
      .filter((damageType) => damageType.damageGroup === type)
      .map((damageType) => damageType.name);
    const resistanceTypes = damageNames.length > 0 ? damageNames : [type];

    resistanceTypes.forEach((resistanceType) => {
      totals[resistanceType] = (totals[resistanceType] ?? 0) + Number(value);
    });
  });
}

export function getCharacterResistances(character: {
  armor: string;
  species: string | null;
  selections: Record<string, string>;
}): Record<string, number> {
  const totals: Record<string, number> = {};
  const sources: ResistanceSource[] = [
    ...armors,
    ...species,
    ...ancestryFeats,
    ...advantages,
    ...generalFeats,
  ];

  [character.armor, character.species, ...Object.values(character.selections)]
    .filter((name): name is string => Boolean(name))
    .forEach((name) => {
      addResistances(
        totals,
        sources.find((source) => source.name === name)?.resistances,
      );
    });

  return totals;
}

export function getCompactResistances(
  resistances: Record<string, number>,
): Record<string, number> {
  const compact: Record<string, number> = {};
  const groups = Array.from(
    new Set(damageTypes.map((damageType) => damageType.damageGroup)),
  );

  groups.forEach((group) => {
    const groupTypes = damageTypes.filter(
      (damageType) => damageType.damageGroup === group,
    );
    const groupValues = groupTypes.map(({ name }) => resistances[name]);
    const hasEveryType = groupValues.every((value) => value !== undefined);

    if (!hasEveryType) {
      groupTypes.forEach(({ name }) => {
        if (resistances[name] > 0) compact[name] = resistances[name];
      });
      return;
    }

    const baseline = Math.min(...groupValues);
    if (baseline <= 0) return;

    compact[group] = baseline;
    groupTypes.forEach(({ name }) => {
      if (resistances[name] > baseline) compact[name] = resistances[name];
    });
  });

  return compact;
}

export function getCharacterSpeeds(character: {
  species: string | null;
  selections: Record<string, string>;
}): Record<SpeedTypes, number> {
  const speeds: Record<SpeedTypes, number> = {
    Land: 5,
    Swim: 0,
    Climb: 0,
    Burrow: 0,
    Glide: 0,
    Fly: 0,
  };
  const sources: SpeedSource[] = [
    ...species,
    ...ancestryFeats,
    ...advantages,
    ...generalFeats,
  ];

  [character.species, ...Object.values(character.selections)]
    .filter((name): name is string => Boolean(name))
    .forEach((name) => {
      sources
        .find((source) => source.name === name)
        ?.speeds?.split(",")
        .forEach((speed) => {
          const match = speed.trim().match(/^\((-?\d+)\)\s+(.+)$/);
          if (!match) return;

          const [, value, type] = match;
          if (type in speeds) {
            speeds[type as SpeedTypes] += Number(value);
          }
        });
    });

  return speeds;
}
