import ChoiceModal from "./ChoiceModal";
import type { ModalRequest } from "./modalTypes";
import { getChoiceData } from "./choiceData";
import { useCharacter } from "../../contexts/CharacterContext";
import backgrounds from "../../JSON/backgrounds.json";
import { STAT_COLORS } from "../../constants/Stats";
import type { StatKey } from "../../types/StatKey";
import { useState } from "react";

type BaseStatArray = 3 | 1 | 0 | -1;

const BASE_STAT_VALUES: BaseStatArray[] = [3, 1, 0, -1];

const BASE_STAT_KEYS: { key: StatKey; label: string }[] = [
  { key: "PHY", label: "Physique" },
  { key: "DEX", label: "Dexterity" },
  { key: "INT", label: "Intelligence" },
  { key: "WIL", label: "Willpower" },
];

const formatValue = (value: BaseStatArray) =>
  value > 0 ? `+${value}` : `${value}`;

/**
 * Builds a valid assignment from a partial one:
 * values not explicitly assigned are handed out (in BASE_STAT_VALUES
 * order) to the stats that don't have one yet. The result is always a
 * permutation of BASE_STAT_VALUES.
 */
function buildAssignment(
  assigned: Partial<Record<StatKey, BaseStatArray>>,
): Record<StatKey, BaseStatArray> {
  const used = new Set(Object.values(assigned));
  const remaining = BASE_STAT_VALUES.filter((v) => !used.has(v));
  let i = 0;
  return Object.fromEntries(
    BASE_STAT_KEYS.map(({ key }) => [key, assigned[key] ?? remaining[i++]]),
  ) as Record<StatKey, BaseStatArray>;
}

function normalizeBaseStats(
  stats: Record<StatKey, number>,
): Record<StatKey, BaseStatArray> {
  const values = BASE_STAT_KEYS.map(({ key }) => stats[key]);
  const isValid =
    values.every((v) => BASE_STAT_VALUES.includes(v as BaseStatArray)) &&
    new Set(values).size === BASE_STAT_VALUES.length;

  return isValid
    ? (Object.fromEntries(
        BASE_STAT_KEYS.map(({ key }) => [key, stats[key] as BaseStatArray]),
      ) as Record<StatKey, BaseStatArray>)
    : buildAssignment({});
}

function BaseStatsEditor({ closeModal }: { closeModal: () => void }) {
  const { character, updateCharacter } = useCharacter();
  const [baseStats, setBaseStats] = useState<Record<StatKey, BaseStatArray>>(
    () => normalizeBaseStats(character.baseStats),
  );
  const [selectedValue, setSelectedValue] = useState<BaseStatArray | null>(
    null,
  );

  const statOwningValue = (value: BaseStatArray) =>
    BASE_STAT_KEYS.find(({ key }) => baseStats[key] === value)?.key;

  /**
   * Two-tap assignment: tap a value in the pool, then tap a stat.
   * The stat's previous value returns to the pool.
   */
  const assignTo = (key: StatKey) => {
    if (selectedValue === null) return;
    setBaseStats((current) => {
      const next = { ...current };
      const displaced = current[key];
      next[key] = selectedValue;
      // Give the displaced value to whoever held the selected value, if anyone.
      const previousOwner = BASE_STAT_KEYS.find(
        ({ key: k }) => k !== key && next[k] === selectedValue,
      )?.key;
      if (previousOwner) {
        next[previousOwner] = displaced;
      }
      return next;
    });
    setSelectedValue(null);
  };

  const resetToDefault = () => {
    setBaseStats(buildAssignment({}));
    setSelectedValue(null);
  };

  const confirmStats = () => {
    updateCharacter({ baseStats });
    closeModal();
  };

  return (
    <div className="space-y-4">
      {/* Value pool: tap one, then tap a stat below to place it. */}
      <div className="flex items-center justify-center gap-2">
        {BASE_STAT_VALUES.map((value) => {
          const owner = statOwningValue(value);
          const isSelected = selectedValue === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedValue(isSelected ? null : value)}
              className={`rounded-md border-2 px-3 py-2 text-lg font-bold transition ${
                isSelected
                  ? "border-blue-600 bg-blue-600 text-white"
                  : owner
                    ? "border-gray-300 bg-gray-100 text-gray-500"
                    : "border-blue-400 bg-white text-blue-700 hover:bg-blue-50"
              }`}
              title={owner ? `Currently on ${owner}` : "Unassigned"}
            >
              {formatValue(value)}
              {owner && !isSelected && (
                <span className="ml-1 text-xs font-semibold">{owner}</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-600">
        {selectedValue === null
          ? "Tap a value above, then tap a stat to place it."
          : `Placing ${formatValue(selectedValue)} — tap a stat below.`}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {BASE_STAT_KEYS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => assignTo(key)}
            className={`flex items-center justify-between gap-4 rounded-md border-2 p-3 text-left transition ${
              selectedValue !== null
                ? "border-orange-400 bg-sky-100 hover:bg-sky-200"
                : "border-gray-200 bg-sky-100 opacity-80"
            }`}
          >
            <span className="font-semibold text-gray-800">
              <span className={`mr-2 font-bold ${STAT_COLORS[key]}`}>
                {key}
              </span>
              {label}
            </span>
            <span className="rounded-md bg-white px-3 py-1 text-lg font-bold text-gray-800">
              {formatValue(baseStats[key])}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={confirmStats}
        >
          Set Base Stats
        </button>
        <button
          type="button"
          className="rounded-md border-2 border-blue-400 px-4 py-2 font-bold text-blue-700 hover:bg-blue-50"
          onClick={resetToDefault}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

interface ModalWrapperProps {
  request: ModalRequest;
  closeModal: () => void;
}

export default function ModalWrapper({
  request,
  closeModal,
}: ModalWrapperProps) {
  const { character, updateCharacter } = useCharacter();
  const choiceData = getChoiceData(request);

  const getCurrentValue = () => {
    if (request.type === "spell" && request.rank) {
      return request.replaceSpell ?? null;
    }
    if (request.type === "weapon") {
      return request.replaceWeapon ?? null;
    }
    if (request.type === "armor") return character.armor;
    if (request.type === "species") return character.species;
    if (request.type === "background") return character.background;
    if (request.type !== "baseStats") {
      return character.selections[request.selectionKey] ?? null;
    }
    return null;
  };

  const getBlockedChoiceNames = () => {
    if (request.type === "spell" && request.rank) {
      return character.knownSpells;
    }

    if (request.type === "weapon") {
      return character.weapons.filter(
        (weaponName) => weaponName !== request.replaceWeapon,
      );
    }

    if (request.type === "species" || request.type === "baseStats") {
      return [];
    }

    const choiceNames = new Set(
      choiceData[request.type].map((item) => item.name),
    );
    const ownedNames = new Set<string>();
    Object.entries(character.selections).forEach(([key, selectedValue]) => {
      const isSameTypeSelection = key.startsWith(`${request.type}:`);
      const isNestedChoice = choiceNames.has(selectedValue);

      if (
        key !== request.selectionKey &&
        (isSameTypeSelection || isNestedChoice)
      ) {
        ownedNames.add(selectedValue);
      }
    });

    return choiceData[request.type]
      .filter((item) => {
        const repeatableValue = item.repeatable;
        const isRepeatable =
          repeatableValue === true ||
          repeatableValue === 1 ||
          repeatableValue === "1";
        return ownedNames.has(item.name) && !isRepeatable;
      })
      .map((item) => item.name);
  };

  const confirmChoice = (value: string) => {
    const isBlockedDuplicate =
      request.type !== "species" &&
      request.type !== "baseStats" &&
      getBlockedChoiceNames().includes(value) &&
      value !== (request.type === "spell" ? request.replaceSpell : undefined);

    if (isBlockedDuplicate) {
      return;
    }

    if (request.type === "species") {
      updateCharacter({ species: value });
    } else if (request.type === "background") {
      const selectedBackground = backgrounds.find(
        (background) => background.name === value,
      );
      const backgroundFeatKey = `${request.selectionKey}:unlocked:0`;

      updateCharacter({
        background: value,
        selections: {
          ...character.selections,
          [request.selectionKey]: value,
          ...(selectedBackground?.generalFeat
            ? { [backgroundFeatKey]: selectedBackground.generalFeat }
            : {}),
        },
      });
    } else if (request.type === "spell" && request.rank) {
      const knownSpells = character.knownSpells.filter(
        (spellName) => spellName !== request.replaceSpell,
      );
      updateCharacter({
        knownSpells: knownSpells.includes(value)
          ? knownSpells
          : [...knownSpells, value],
      });
    } else if (request.type === "weapon") {
      const weapons = character.weapons.filter(
        (weaponName) => weaponName !== request.replaceWeapon,
      );
      updateCharacter({
        weapons: weapons.includes(value) ? weapons : [...weapons, value],
      });
    } else if (request.type === "armor") {
      updateCharacter({ armor: value });
    } else if (request.type === "metamagic") {
      const metamagics = character.metamagics.filter(
        (spellName) => spellName !== request.replaceMetamagic,
      );
      updateCharacter({
        metamagics: metamagics.includes(value)
          ? metamagics
          : [...metamagics, value],
      });
    } else if (request.type !== "baseStats") {
      updateCharacter({
        selections: { ...character.selections, [request.selectionKey]: value },
      });
    }
    closeModal();
  };

  const renderModalContent = () => {
    if (request.type !== "baseStats") {
      return (
        <ChoiceModal
          items={choiceData[request.type]}
          confirmLabel={request.title}
          initialValue={getCurrentValue()}
          maxLevel={request.type === "species" ? Infinity : request.level}
          disabledNames={getBlockedChoiceNames()}
          filterFields={
            request.type === "spell"
              ? [
                  { label: "Aspects", value: "aspects" },
                  { label: "Traits", value: "traits" },
                ]
              : request.type === "weapon"
                ? [
                    { label: "Traits", value: "traits" },
                    { label: "Types", value: "type" },
                    { label: "Weapon Groups", value: "weaponGroup" },
                  ]
                : undefined
          }
          onConfirm={confirmChoice}
        />
      );
    }

    return <BaseStatsEditor closeModal={closeModal} />;
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-6xl w-11/12 h-[85vh] overflow-auto shadow-2xl border border-gray-300"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 border-b-2 border-striking">
          <h2 className="text-3xl font-bold text-gray-800">{request.title}</h2>
          <button
            type="button"
            className="text-2xl text-gray-600 hover:text-gray-900"
            onClick={closeModal}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        {renderModalContent()}
      </div>
    </div>
  );
}
