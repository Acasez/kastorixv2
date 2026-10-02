import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  useCreature,
  type CreatureTrack,
} from "../../contexts/CreatureContext";
import { CREATURE_SIZES } from "../../constants/CreatureSizes";
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
import CreatureHeader from "./CreatureHeader";
import CreatureActionList from "./CreatureActionList";
import CreaturePassiveList from "./CreaturePassiveList";
import CreatureArmorSelector from "./CreatureArmorSelector";
import CreatureSenses from "./CreatureSenses";
import { SPEED_TYPES } from "../../constants/SpeedTypes";
import { normalizeCreature } from "../../utils/normalizeCreature";

export type CreatureSize = (typeof CREATURE_SIZES)[number];

const STORAGE_CHANGE_EVENT = "dm-creature-storage-change";

const DAMAGE_TYPE_NAMES = damageTypes.map(({ name }) => name);
const RESISTANCE_OPTIONS = [
  ...DAMAGE_TYPE_NAMES,
  ...new Set(damageTypes.map(({ damageGroup }) => damageGroup)),
];
const textFields = [
  ["traits", "Traits"],
  ["languages", "Languages"],
] as const;

type ResourceKey = "health" | "aura" | "mana";

function scaleTrackToMax(track: CreatureTrack, max: number): CreatureTrack {
  if (track.max === max) return track;
  const proportion = track.max > 0 ? track.current / track.max : 0;
  return {
    current: Math.min(max, Math.max(0, Math.round(proportion * max))),
    max,
  };
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

  const updateResourceTrack = (key: ResourceKey, nextTrack: CreatureTrack) => {
    if (key === "health") {
      updateCreature({
        health:
          nextTrack.max === creature.health.max
            ? nextTrack
            : scaleTrackToMax(creature.health, nextTrack.max),
      });
      return;
    }

    const nextAura =
      key === "aura"
        ? nextTrack.max === creature.aura.max
          ? nextTrack
          : scaleTrackToMax(creature.aura, nextTrack.max)
        : scaleTrackToMax(creature.aura, nextTrack.max);
    const nextMana =
      key === "mana"
        ? nextTrack.max === creature.mana.max
          ? nextTrack
          : scaleTrackToMax(creature.mana, nextTrack.max)
        : scaleTrackToMax(creature.mana, nextTrack.max);

    updateCreature({ aura: nextAura, mana: nextMana });
  };

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
      const raw = localStorage.getItem(selectedKey) ?? "null";
      setCreature(normalizeCreature(JSON.parse(raw)));
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
      setCreature(normalizeCreature(imported));
    } catch {
      window.alert("The selected file is not a valid creature JSON file.");
    }
  };

  return (
    <section className="w-full max-w-8xl overflow-hidden border border-stone-700 bg-bg-creature text-text-light shadow-lg">
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

      <div className="flex flex-col gap-3 px-4 py-2">
        {/* Row 1 — identity fields, packed into one grid instead of 2-per-line */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
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

          <CreatureArmorSelector />
        </div>

        {/* Row 2a — Resources strip: bars want horizontal room, so let them span the panel */}
        <section>
          <CreatureHeader title="Resources" />
          <HealthManaAuraBars
            tracks={{
              health: creature.health,
              aura: creature.aura,
              mana: creature.mana,
            }}
            onTrackChange={updateResourceTrack}
          />
        </section>

        {/* Row 2b — three columns, sized by what they hold */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-2">
          {/* Col 1 — growable lists: UNCHANGED, you like this one */}
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <CreatureSenses />
            </div>
            <CreatureSkillList />
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
              options={RESISTANCE_OPTIONS}
              values={creature.resistances}
              onChange={(resistances) => updateCreature({ resistances })}
              typeWidthClass="w-28"
              allowNegative={true}
            />
          </div>

          {/* Right — numbers + combat, in priority order */}
          <div className="flex min-w-0 flex-col gap-3">
            <div>
              <CreatureHeader title="Stats" />
              <StatsGrid
                stats={creature.stats}
                onStatChange={(key, value) =>
                  updateCreature({ stats: { ...creature.stats, [key]: value } })
                }
                columnsClassName="px-0"
              />
            </div>
            <CreatureSavingThrows />
            <CreatureStrikeList />
            <CreatureSpellList />
          </div>
        </div>

        {/* Row 3 — the tall text sections, two up */}
        <div className="grid grid-cols-1 items-start gap-x-4 lg:grid-cols-2">
          <CreatureActionList />
          <CreaturePassiveList />
        </div>
      </div>
    </section>
  );
}
