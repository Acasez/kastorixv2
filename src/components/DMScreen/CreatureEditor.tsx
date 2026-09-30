import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  useCreature,
  type Creature,
  type CreatureSaveKey,
} from "../../contexts/CreatureContext";
import {
  getProficiency,
  PROFICIENCY_LEVELS,
  type ProficiencyTierName,
} from "../../constants/Proficiency";
import { CREATURE_SIZES } from "../../constants/CreatureSizes";
import type { SpeedTypes } from "../../types/SpeedTypes";
import StatsGrid from "../Buttons/StatsGrid";
import HealthManaAuraBars from "../Buttons/HealthManaAuraBars";
import ProficiencyMarker from "../Buttons/ProficiencyMarker";
import CreatureMeta, { STORAGE_PREFIX } from "./CreatureMeta";
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
const textFields = [
  ["traits", "Traits"],
  ["senses", "Senses"],
  ["skills", "Skills"],
  ["languages", "Languages"],
  ["armor", "Armor"],
  ["resistances", "Resistances"],
  ["strikes", "Strikes"],
  ["actions", "Actions"],
  ["spells", "Spells"],
  ["passives", "Passives"],
] as const;

type CreatureData = Omit<Creature, "savingThrows" | "speeds"> & {
  savingThrows: Record<CreatureSaveKey, ProficiencyTierName | number>;
  speeds: Creature["speeds"] | string;
};

function isCreature(value: unknown): value is CreatureData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Creature>;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.size === "string" &&
    textFields.every(([key]) => typeof candidate[key] === "string") &&
    isCreatureSpeeds(candidate.speeds) &&
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
    speeds: normalizeSpeeds(value.speeds),
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
  const availableSpeeds = SPEED_TYPES.filter(
    (speed) => !(speed in creature.speeds),
  );

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

  const addSpeed = () => {
    const speed = availableSpeeds[0];
    if (!speed) return;
    updateCreature({ speeds: { ...creature.speeds, [speed]: 0 } });
  };

  const changeSpeedType = (currentSpeed: SpeedTypes, nextSpeed: SpeedTypes) => {
    const nextSpeeds = { ...creature.speeds };
    const distance = nextSpeeds[currentSpeed] ?? 0;
    delete nextSpeeds[currentSpeed];
    nextSpeeds[nextSpeed] = distance;
    updateCreature({ speeds: nextSpeeds });
  };

  const removeSpeed = (speed: SpeedTypes) => {
    const nextSpeeds = { ...creature.speeds };
    delete nextSpeeds[speed];
    updateCreature({ speeds: nextSpeeds });
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

        <section>
          <h2 className="creature-section-title">Saving Throws</h2>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { name: "Fortitude", stat: "PHY" },
                { name: "Reflex", stat: "DEX" },
                { name: "Will", stat: "WIL" },
              ] as const
            ).map((save) => {
              const tierName = creature.savingThrows[save.name];
              const tier = getProficiency(tierName);
              const bonus = creature.stats[save.stat] + tier.bonus;

              return (
                <div
                  className="flex items-center justify-center gap-1.5 rounded border-2 border-red-500 px-2 py-1"
                  key={save.name}
                >
                  <span className="font-semibold text-sky-500">
                    {save.name} ({save.stat})
                  </span>
                  <ProficiencyMarker
                    skillName={save.name}
                    proficiency={tierName}
                    onProficiencyChange={(proficiency) =>
                      updateCreature({
                        savingThrows: {
                          ...creature.savingThrows,
                          [save.name]: proficiency,
                        },
                      })
                    }
                  />
                  <span
                    className="text-xl text-text-light"
                    aria-label={`${save.name} bonus ${bonus}`}
                  >
                    {bonus > 0 ? `+${bonus}` : bonus}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="creature-section-title mb-0 flex-1">Speeds</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {Object.entries(creature.speeds).map(([type, speed]) => {
              const speedType = type as SpeedTypes;
              return (
                <div
                  className="relative inline-flex items-center gap-2 rounded border border-stone-600 bg-stone-800 p-2 pr-3"
                  key={type}
                >
                  <label>
                    <span className="sr-only">{speedType} speed type</span>
                    <select
                      aria-label={`${speedType} speed type`}
                      value={speedType}
                      onChange={(event) =>
                        changeSpeedType(
                          speedType,
                          event.target.value as SpeedTypes,
                        )
                      }
                      className="h-8 w-20 rounded border border-stone-500 bg-stone-900 px-1 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                    >
                      {SPEED_TYPES.filter(
                        (candidate) =>
                          candidate === speedType ||
                          !(candidate in creature.speeds),
                      ).map((candidate) => (
                        <option key={candidate} value={candidate}>
                          {candidate}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="sr-only">{speedType} speed</span>
                    <input
                      type="number"
                      min={0}
                      value={speed}
                      aria-label={`${speedType} speed`}
                      onChange={(event) =>
                        updateCreature({
                          speeds: {
                            ...creature.speeds,
                            [speedType]: Math.max(
                              0,
                              Number(event.target.value),
                            ),
                          },
                        })
                      }
                      className="h-8 w-16 rounded border border-stone-500 bg-stone-900 px-1 text-center text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                    />
                  </label>
                  <button
                    className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold leading-none text-white hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                    onClick={() => removeSpeed(speedType)}
                    aria-label={`Remove ${speedType} speed`}
                    title={`Remove ${speedType} speed`}
                  >
                    ×
                  </button>
                </div>
              );
            })}
            <button
              className="flex size-8 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
              onClick={addSpeed}
              disabled={availableSpeeds.length === 0}
              aria-label="Add speed"
              title="Add speed"
            >
              +
            </button>
          </div>
        </section>

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
