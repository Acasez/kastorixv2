import ChoiceModal from "./ChoiceModal";
import type { ModalRequest } from "./modalTypes";
import { getChoiceData } from "./choiceData";
import { useCharacter } from "../../contexts/CharacterContext";
import backgrounds from "../../JSON/backgrounds.json";
import { BaseStatsEditor } from "./BaseStatModal";
import { StatIncreaseModal } from "./StatIncreaseModal";
import ChoiceModalFrame from "./ChoiceModalFrame";

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
    if (request.type === "gadget") {
      return request.replaceGadget ?? null;
    }
    if (request.type === "armor") return character.armor;
    if (request.type === "species") return character.species;
    if (request.type === "background") return character.background;
    if (request.type !== "baseStats" && request.type !== "statIncrease") {
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

    if (request.type === "gadget") {
      return character.gadgets.filter(
        (gadgetName) => gadgetName !== request.replaceGadget,
      );
    }

    if (
      request.type === "species" ||
      request.type === "baseStats" ||
      request.type === "statIncrease"
    ) {
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

  const confirmChoice = (value: string, choice?: string) => {
    const isBlockedDuplicate =
      request.type !== "species" &&
      request.type !== "baseStats" &&
      request.type !== "statIncrease" &&
      getBlockedChoiceNames().includes(value) &&
      value !== (request.type === "spell" ? request.replaceSpell : undefined);

    if (isBlockedDuplicate) {
      return;
    }

    if (request.type === "species") {
      const selections =
        character.species === value
          ? character.selections
          : Object.fromEntries(
              Object.entries(character.selections).filter(
                ([key]) => !key.startsWith("species:unlocked:"),
              ),
            );
      updateCharacter({ species: value, selections });
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
    } else if (request.type === "gadget") {
      const gadgets = character.gadgets.filter(
        (gadgetName) => gadgetName !== request.replaceGadget,
      );
      updateCharacter({
        gadgets: gadgets.includes(value) ? gadgets : [...gadgets, value],
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
    } else if (
      request.type !== "baseStats" &&
      request.type !== "statIncrease"
    ) {
      const choiceKey = `${request.selectionKey}:choice`;
      const selections = Object.fromEntries(
        Object.entries(character.selections).filter(
          ([key]) => key !== choiceKey,
        ),
      );
      const previousItem = choiceData[request.type].find(
        (item) => item.name === character.selections[request.selectionKey],
      );
      const selectedItem = choiceData[request.type].find(
        (item) => item.name === value,
      );
      const updatesGolemModel =
        request.type === "advantage" &&
        (previousItem?.choice === "Golem Model - Choice" ||
          selectedItem?.choice === "Golem Model - Choice");
      updateCharacter({
        selections: {
          ...selections,
          [request.selectionKey]: value,
          ...(choice ? { [choiceKey]: choice } : {}),
        },
        ...(updatesGolemModel
          ? {
              golemModel:
                selectedItem?.choice === "Golem Model - Choice"
                  ? (choice ?? null)
                  : null,
            }
          : {}),
      });
    }
    closeModal();
  };

  const renderModalContent = () => {
    if (request.type !== "baseStats" && request.type !== "statIncrease") {
      return (
        <ChoiceModal
          items={choiceData[request.type]}
          confirmLabel={request.title}
          initialValue={getCurrentValue()}
          initialChoice={
            request.type === "species"
              ? null
              : (character.selections[`${request.selectionKey}:choice`] ?? null)
          }
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

    if (request.type === "baseStats") {
      return <BaseStatsEditor closeModal={closeModal} />;
    }

    return (
      <StatIncreaseModal
        selectionKey={request.selectionKey}
        closeModal={closeModal}
      />
    );
  };

  return (
    <ChoiceModalFrame title={request.title} closeModal={closeModal}>
      {renderModalContent()}
    </ChoiceModalFrame>
  );
}
