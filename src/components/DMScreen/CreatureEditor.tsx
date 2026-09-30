import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  useCreature,
  type Creature,
  type CreatureSaveKey,
} from "../../contexts/CreatureContext";
import {
  PROFICIENCY_LEVELS,
  type ProficiencyTierName,
} from "../../constants/Proficiency";
import { CREATURE_SIZES } from "../../constants/CreatureSizes";
import type { SpeedTypes } from "../../types/SpeedTypes";
import damageTypes from "../../JSON/damage_types.json";
import skills from "../../json/skills.json";
import weapons from "../../JSON/weapons.json";
import StatsGrid from "../Buttons/StatsGrid";
import HealthManaAuraBars from "../Buttons/HealthManaAuraBars";
import CreatureMeta, { STORAGE_PREFIX } from "./CreatureMeta";
import NumericTypeList from "./NumericTypeList";
import CreatureSkillList from "./CreatureSkillList";
import CreatureStrikeList from "./CreatureStrikeList";
import CreatureSavingThrows from "./CreatureSavingThrows";
export type CreatureSize = (typeof CREATURE_SIZES)[number];

const STORAGE_CHANGE_EVENT = "dm-creature-storage-change";
const SPEED_TYPES: SpeedTypes[] = [
  "Land",
  "Swim",
  "Climb",
  "Burrow",
  "Glide",
  "Fly",
];
const DAMAGE_TYPE_NAMES = damageTypes.map(({ name }) => name);
const textFields = [
  ["traits", "Traits"],
  ["senses", "Senses"],
  ["languages", "Languages"],
  ["armor", "Armor"],
  ["actions", "Actions"],
  ["spells", "Spells"],
  ["passives", "Passives"],
] as const;

type CreatureData = Omit<
  Creature,
  "savingThrows" | "speeds" | "resistances" | "skills" | "strikes"
> & {
  savingThrows: Record<CreatureSaveKey, ProficiencyTierName | number>;
  speeds: Creature["speeds"] | string;
  resistances: Creature["resistances"] | string;
  skills: Creature["skills"] | string;
  strikes: Creature["strikes"] | string;
};

function isCreature(value: unknown): value is CreatureData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CreatureData>;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.size === "string" &&
    textFields.every(([key]) => typeof candidate[key] === "string") &&
    isCreatureSkills(candidate.skills) &&
    isCreatureStrikes(candidate.strikes) &&
    isCreatureSpeeds(candidate.speeds) &&
    isCreatureResistances(candidate.resistances) &&
    ["PHY", "DEX", "INT", "WIL"].every(
      (key) =>
        typeof candidate.stats?.[key as keyof Creature["stats"]] === "number",
    ) &&
    isTrack(candidate.health) &&
    isTrack(candidate.aura) &&
    isTrack(candidate.mana) &&
    ["Fortitude", "Reflex", "Will"].every((save) => {
      const saveValue = candidate.savingThrows?.[save as CreatureSaveKey];
      return (
        typeof saveValue === "number" ||
        PROFICIENCY_LEVELS.some((tier) => tier.fullName === saveValue)
      );
    })
  );
}

function isCreatureStrikes(value: unknown): value is CreatureData["strikes"] {
  if (typeof value === "string") return true;
  if (typeof value !== "object" || value === null) return false;
  const weaponNames = weapons.map(({ name }) => name);
  return Object.entries(value).every(
    ([weaponName, proficiency]) =>
      weaponNames.includes(weaponName) &&
      PROFICIENCY_LEVELS.some((tier) => tier.fullName === proficiency),
  );
}

function normalizeStrikes(value: CreatureData["strikes"]): Creature["strikes"] {
  if (typeof value !== "string") return value;

  const normalized: Creature["strikes"] = {};
  const previousNames = value.split(/[,;\n]+/).map((name) => name.trim());
  for (const previousName of previousNames) {
    const weapon = weapons.find(
      ({ name }) => name.toLowerCase() === previousName.toLowerCase(),
    );
    if (weapon) normalized[weapon.name] = "Trained";
  }
  return normalized;
}

function isCreatureSkills(value: unknown): value is CreatureData["skills"] {
  if (typeof value === "string") return true;
  if (typeof value !== "object" || value === null) return false;
  const skillNames = skills.map(({ name }) => name);
  return Object.entries(value).every(
    ([skillName, proficiency]) =>
      skillNames.includes(skillName) &&
      PROFICIENCY_LEVELS.some((tier) => tier.fullName === proficiency),
  );
}

function normalizeSkills(value: CreatureData["skills"]): Creature["skills"] {
  if (typeof value !== "string") return value;

  const normalized: Creature["skills"] = {};
  const previousNames = value.split(/[,;\n]+/).map((name) => name.trim());
  for (const previousName of previousNames) {
    const matchingSkill = skills.find(
      ({ name }) => name.toLowerCase() === previousName.toLowerCase(),
    );
    if (matchingSkill) normalized[matchingSkill.name] = "Untrained";
  }
  return normalized;
}

function isCreatureSpeeds(value: unknown): value is CreatureData["speeds"] {
  if (typeof value === "string") return true;
  if (typeof value !== "object" || value === null) return false;
  return Object.entries(value).every(
    ([speed, distance]) =>
      SPEED_TYPES.includes(speed as SpeedTypes) &&
      typeof distance === "number" &&
      Number.isFinite(distance),
  );
}

function normalizeSpeeds(speeds: CreatureData["speeds"]): Creature["speeds"] {
  if (typeof speeds !== "string") return speeds;

  const normalized: Creature["speeds"] = {};
  const pattern = /(Land|Swim|Climb|Burrow|Glide|Fly)\s*:?\s*(\d+)/gi;
  for (const match of speeds.matchAll(pattern)) {
    const speed = SPEED_TYPES.find(
      (candidate) => candidate.toLowerCase() === match[1].toLowerCase(),
    );
    if (speed) normalized[speed] = Number(match[2]);
  }
  return normalized;
}

function isCreatureResistances(
  value: unknown,
): value is CreatureData["resistances"] {
  if (typeof value === "string") return true;
  if (typeof value !== "object" || value === null) return false;
  return Object.entries(value).every(
    ([damageType, resistance]) =>
      DAMAGE_TYPE_NAMES.includes(damageType) &&
      typeof resistance === "number" &&
      Number.isFinite(resistance),
  );
}

function normalizeResistances(
  resistances: CreatureData["resistances"],
): Creature["resistances"] {
  if (typeof resistances !== "string") return resistances;

  const normalized: Creature["resistances"] = {};
  for (const damageType of DAMAGE_TYPE_NAMES) {
    const escapedType = damageType.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(`\\(\\s*(\\d+)\\s*\\)\\s*${escapedType}`, "gi"),
      new RegExp(`${escapedType}\\s*:?\\s*(\\d+)`, "gi"),
      new RegExp(`(\\d+)\\s+${escapedType}`, "gi"),
    ];

    for (const pattern of patterns) {
      const match = pattern.exec(resistances);
      if (match) {
        normalized[damageType] = Number(match[1] ?? match[2]);
        break;
      }
    }
  }
  return normalized;
}

function normalizeCreature(value: CreatureData): Creature {
  const normalizeTier = (
    tier: ProficiencyTierName | number,
  ): ProficiencyTierName => {
    if (typeof tier === "string") return tier;
    return (
      PROFICIENCY_LEVELS.find((level) => level.bonus === tier)?.fullName ??
      "Untrained"
    );
  };

  return {
    ...value,
    skills: normalizeSkills(value.skills),
    strikes: normalizeStrikes(value.strikes),
    speeds: normalizeSpeeds(value.speeds),
    resistances: normalizeResistances(value.resistances),
    savingThrows: {
      Fortitude: normalizeTier(value.savingThrows.Fortitude),
      Reflex: normalizeTier(value.savingThrows.Reflex),
      Will: normalizeTier(value.savingThrows.Will),
    },
  };
}

function isTrack(value: unknown): value is Creature["health"] {
  return (
    typeof value === "object" &&
    value !== null &&
    "current" in value &&
    typeof value.current === "number" &&
    "max" in value &&
    typeof value.max === "number"
  );
}

function getSavedCreatures(): string[] {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .sort((first, second) => first.localeCompare(second));
}

export default function CreatureEditor({ onRemove }: { onRemove: () => void }) {
  const { creature, setCreature, updateCreature } = useCreature();
  const [savedCreatures, setSavedCreatures] = useState(getSavedCreatures);
  const [selectedKey, setSelectedKey] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const refreshSavedCreatures = () => setSavedCreatures(getSavedCreatures());
    window.addEventListener("storage", refreshSavedCreatures);
    window.addEventListener(STORAGE_CHANGE_EVENT, refreshSavedCreatures);
    return () => {
      window.removeEventListener("storage", refreshSavedCreatures);
      window.removeEventListener(STORAGE_CHANGE_EVENT, refreshSavedCreatures);
    };
  }, []);

  const saveCreature = () => {
    const name = creature.name.trim();
    if (!name) {
      window.alert("Enter a creature name before saving.");
      return;
    }

    const key = `${STORAGE_PREFIX}${name}`;
    localStorage.setItem(key, JSON.stringify(creature));
    setSelectedKey(key);
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
  };

  const loadCreature = () => {
    if (!selectedKey) return;
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem(selectedKey) ?? "",
      );
      if (!isCreature(value)) throw new Error("Invalid creature data");
      setCreature(normalizeCreature(value));
    } catch {
      window.alert("The selected saved creature could not be loaded.");
    }
  };

  const deleteCreature = () => {
    if (!selectedKey) {
      window.alert("Select a saved creature before deleting.");
      return;
    }
    localStorage.removeItem(selectedKey);
    setSelectedKey("");
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
  };

  const exportCreature = () => {
    const file = new Blob([JSON.stringify(creature, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${creature.name.trim() || "creature"}.json`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const importCreature = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const imported: unknown = JSON.parse(await file.text());
      if (!isCreature(imported)) throw new Error("Invalid creature data");
      setCreature(normalizeCreature(imported));
    } catch {
      window.alert("The selected file is not a valid creature JSON file.");
    }
  };

  return (
    <section className="w-full max-w-4xl overflow-hidden border border-stone-700 bg-bg-creature text-text-light shadow-lg">
      <CreatureMeta
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        savedCreatures={savedCreatures}
        saveCreature={saveCreature}
        loadCreature={loadCreature}
        deleteCreature={deleteCreature}
        importInputRef={importInputRef}
        exportCreature={exportCreature}
        onRemove={onRemove}
        importCreature={importCreature}
      />

      <div className="space-y-5 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="creature-field">
            <span>Name</span>
            <input
              value={creature.name}
              onChange={(event) => updateCreature({ name: event.target.value })}
              placeholder="Creature Name"
            />
          </label>
          <label className="creature-field">
            <span>Size</span>
            <select
              value={creature.size}
              onChange={(event) => updateCreature({ size: event.target.value })}
            >
              {CREATURE_SIZES.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          {textFields.slice(0, 4).map(([key, label]) => (
            <label className="creature-field" key={key}>
              <span>{label}</span>
              <input
                value={creature[key]}
                onChange={(event) =>
                  updateCreature({ [key]: event.target.value })
                }
                placeholder={`${label}...`}
              />
            </label>
          ))}
        </div>

        <StatsGrid
          stats={creature.stats}
          onStatChange={(key, value) =>
            updateCreature({ stats: { ...creature.stats, [key]: value } })
          }
        />

        <CreatureSkillList />

        <section>
          <h2 className="creature-section-title">Resources</h2>
          <HealthManaAuraBars
            tracks={{
              health: creature.health,
              aura: creature.aura,
              mana: creature.mana,
            }}
            onTrackChange={(key, track) => updateCreature({ [key]: track })}
          />
        </section>

        <CreatureSavingThrows />

        <NumericTypeList
          title="Speeds"
          itemLabel="speed"
          options={SPEED_TYPES}
          values={creature.speeds}
          onChange={(speeds) => updateCreature({ speeds })}
          typeWidthClass="w-20"
          allowNegative={false}
        />

        <NumericTypeList
          title="Resistances"
          itemLabel="resistance"
          options={DAMAGE_TYPE_NAMES}
          values={creature.resistances}
          onChange={(resistances) => updateCreature({ resistances })}
          typeWidthClass="w-28"
          allowNegative={true}
        />

        <CreatureStrikeList />

        <div className="grid gap-3 sm:grid-cols-2">
          {textFields.slice(4).map(([key, label]) => (
            <label className="creature-field" key={key}>
              <span>{label}</span>
              <textarea
                rows={3}
                value={creature[key]}
                onChange={(event) =>
                  updateCreature({ [key]: event.target.value })
                }
                placeholder={`${label}...`}
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
