import SpeciesModal from "./SpeciesModal";
import ChoiceModal, { type ChoiceItem } from "./ChoiceModal";
import type { ModalRequest } from "./modalTypes";
import { useCharacter } from "../../contexts/CharacterContext";
import backgrounds from "../../JSON/backgrounds.json";
import generalFeats from "../../JSON/general_feats.json";
import arcaneFeats from "../../JSON/arcane_feats.json";
import advantages from "../../JSON/advantages.json";
import ancestryFeats from "../../JSON/ancestry_feats.json";
import golemUpgrades from "../../JSON/golem_upgrades.json";
import runegunUpgrades from "../.././JSON/runegun_upgrades.json";
import spells from "../../JSON/spells.json";
import weapons from "../../JSON/weapons.json";

interface ModalWrapperProps {
  request: ModalRequest;
  closeModal: () => void;
}

export default function ModalWrapper({
  request,
  closeModal,
}: ModalWrapperProps) {
  const { character, updateCharacter } = useCharacter();

  const choiceData: Record<
    Exclude<ModalRequest["type"], "species" | "baseStats">,
    ChoiceItem[]
  > = {
    background: backgrounds,
    generalFeat: generalFeats,
    arcaneFeat: arcaneFeats,
    advantage: advantages,
    ancestryFeat: ancestryFeats,
    golemUpgrade: golemUpgrades,
    runegunUpgrade: runegunUpgrades,
    spell: spells,
    weapon: weapons,
  };

  const getCurrentValue = () => {
    if (request.type === "background") return character.background;
    if (request.type !== "species" && request.type !== "baseStats") {
      return character.selections[request.selectionKey] ?? null;
    }
    return null;
  };

  const getBlockedChoiceNames = () => {
    if (request.type === "species" || request.type === "baseStats") {
      return [];
    }

    const ownedNames = new Set<string>();
    Object.entries(character.selections).forEach(([key, selectedValue]) => {
      if (key !== request.selectionKey && key.startsWith(`${request.type}:`)) {
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
      getBlockedChoiceNames().includes(value);

    if (isBlockedDuplicate) {
      return;
    }

    if (request.type === "background") {
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
    } else if (request.type !== "species" && request.type !== "baseStats") {
      updateCharacter({
        selections: { ...character.selections, [request.selectionKey]: value },
      });
    }
    closeModal();
  };

  const renderModalContent = () => {
    if (request.type === "species") {
      return <SpeciesModal closeModal={closeModal} />;
    }

    if (request.type !== "baseStats") {
      return (
        <ChoiceModal
          items={choiceData[request.type]}
          confirmLabel={request.title}
          initialValue={getCurrentValue()}
          maxLevel={request.level}
          disabledNames={getBlockedChoiceNames()}
          onConfirm={confirmChoice}
        />
      );
    }

    return (
      <div className="border-amber-200 border-2 p-4">
        <p className="text-gray-700">
          The {request.title.toLowerCase()} selector is not implemented yet.
        </p>
      </div>
    );
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
