import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useCreature, type Creature } from "../../contexts/CreatureContext";
import { CREATURE_SIZES } from "../../constants/CreatureSizes";
import type { SpeedTypes } from "../../types/SpeedTypes";
import damageTypes from "../../JSON/damage_types.json";
import StatsGrid from "../Buttons/StatsGrid";
import HealthManaAuraBars from "../Buttons/HealthManaAuraBars";
import CreatureMeta, { STORAGE_PREFIX } from "./CreatureMeta";
import NumericTypeList from "./NumericTypeList";
import CreatureSkillList from "./CreatureSkillList";
import CreatureStrikeList from "./CreatureStrikeList";
import CreatureSavingThrows from "./CreatureSavingThrows";
import CreatureTextField from "./CreatureTextField";
import CreatureSpellList from "./CreatureSpellList";

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
  ["passives", "Passives"],
] as const;

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
      setCreature(value as Creature);
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
      setCreature(imported as Creature);
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

      <div className="px-4 py-2">
        <div className="grid gap-2 sm:grid-cols-2 mb-2">
          <CreatureTextField
            field="Name"
            value={creature.name}
            onChange={(value) => updateCreature({ name: value })}
          />
          <label className="flex min-w-0 flex-col gap-1 text-sm font-semibold leading-5 text-stone-200">
            <span>Size</span>
            <select
              className="w-full min-w-0 rounded-xs border border-[#5b554d] bg-[#242321] px-[0.55rem] py-[0.45rem] font-normal text-[#f5eee4]"
              value={creature.size}
              onChange={(event) => updateCreature({ size: event.target.value })}
            >
              {CREATURE_SIZES.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          {textFields.slice(0, 4).map(([key, label]) => (
            <CreatureTextField
              key={key}
              field={label}
              value={creature[key]}
              onChange={(value) => updateCreature({ [key]: value })}
            />
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
          <h2 className="mb-[0.65rem] border-b border-[#3c3935] pb-[0.35rem] text-center text-xl font-bold leading-6 text-[#ff7043]">
            Resources
          </h2>
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

        <CreatureSpellList />

        <div className="grid gap-3 sm:grid-cols-2">
          {textFields.slice(4).map(([key, label]) => (
            <label
              className="flex min-w-0 flex-col gap-1 text-sm font-semibold leading-5 text-stone-200"
              key={key}
            >
              <span>{label}</span>
              <textarea
                rows={3}
                className="w-full min-w-0 resize-y rounded-xs border border-[#5b554d] bg-[#242321] px-[0.55rem] py-[0.45rem] font-normal text-[#f5eee4]"
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
