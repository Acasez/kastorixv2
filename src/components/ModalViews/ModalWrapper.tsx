import ChoiceModal from "./ChoiceModal";
import type { ModalRequest } from "./modalTypes";
import { getChoiceData } from "./choiceData";
import { useCharacter } from "../../contexts/CharacterContext";
import backgrounds from "../../JSON/backgrounds.json";

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
              : undefined
          }
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
