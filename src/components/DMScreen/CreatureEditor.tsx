import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useCreature, type Creature } from "../../contexts/CreatureContext";
import { CREATURE_SIZES } from "../../constants/CreatureSizes";
import StatsGrid from "../CharacterSheet/CoreStatSection/StatsGrid";
import HealthManaAuraBars from "../CharacterSheet/CoreStatSection/HealthManaAuraBars";
import CreatureMeta, { STORAGE_PREFIX } from "./CreatureMeta";
export type CreatureSize = (typeof CREATURE_SIZES)[number];

const STORAGE_CHANGE_EVENT = "dm-creature-storage-change";
const textFields = [
  ["traits", "Traits"],
  ["senses", "Senses"],
  ["skills", "Skills"],
  ["languages", "Languages"],
  ["armor", "Armor"],
  ["resistances", "Resistances"],
  ["speeds", "Speeds"],
  ["strikes", "Strikes"],
  ["actions", "Actions"],
  ["spells", "Spells"],
  ["passives", "Passives"],
] as const;

function isCreature(value: unknown): value is Creature {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Creature>;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.size === "string" &&
    textFields.every(([key]) => typeof candidate[key] === "string") &&
    ["PHY", "DEX", "INT", "WIL"].every(
      (key) =>
        typeof candidate.stats?.[key as keyof Creature["stats"]] === "number",
    ) &&
    isTrack(candidate.health) &&
    isTrack(candidate.aura) &&
    isTrack(candidate.mana) &&
    typeof candidate.savingThrows?.Fortitude === "number" &&
    typeof candidate.savingThrows.Reflex === "number" &&
    typeof candidate.savingThrows.Will === "number"
  );
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
      setCreature(value);
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
      setCreature(imported);
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
            {(["Fortitude", "Reflex", "Will"] as const).map((save) => (
              <label className="creature-field" key={save}>
                <span>{save}</span>
                <input
                  type="number"
                  value={creature.savingThrows[save]}
                  onChange={(event) =>
                    updateCreature({
                      savingThrows: {
                        ...creature.savingThrows,
                        [save]: Number(event.target.value),
                      },
                    })
                  }
                />
              </label>
            ))}
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
