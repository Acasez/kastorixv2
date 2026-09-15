import { useState } from "react";
import OpenModalButton from "../OpenModalButton";
import ModalWrapper from "../../ModalViews/ModalWrapper";
import type { ModalRequest } from "../../ModalViews/modalTypes";
import { getLevelActions } from "../../../utils/LevelCardUtils";
import { useCharacter } from "../../../contexts/CharacterContext";
import generalFeats from "../../../JSON/general_feats.json";
import arcaneFeats from "../../../JSON/arcane_feats.json";
import advantages from "../../../JSON/advantages.json";
import ancestryFeats from "../../../JSON/ancestry_feats.json";

type ChoiceType = Exclude<ModalRequest["type"], "species" | "baseStats">;

type UnlockableItem = {
  name: string;
  unlockedFeats?: string;
};

type UnlockedChoice = {
  type: ChoiceType;
  title: string;
  level: number;
  selectionKey: string;
};

type ParsedUnlockedChoice = Omit<UnlockedChoice, "selectionKey">;

const unlockableData: Record<string, UnlockableItem[]> = {
  generalFeat: generalFeats,
  arcaneFeat: arcaneFeats,
  advantage: advantages,
  ancestryFeat: ancestryFeats,
};

const actionTypes: Record<string, ChoiceType | "baseStats"> = {
  "Select Background": "background",
  "Select Advantage": "advantage",
  "Select Ancestry Feat": "ancestryFeat",
  "Select Arcane Feat": "arcaneFeat",
  "Select General Feat": "generalFeat",
  "Increase One Stat": "baseStats",
};

const choiceTitles: Record<ChoiceType, string> = {
  background: "Select Background",
  generalFeat: "Select General Feat",
  arcaneFeat: "Select Arcane Feat",
  advantage: "Select Advantage",
  ancestryFeat: "Select Ancestry Feat",
  spell: "Select Spell",
  weapon: "Select Weapon",
};

function parseUnlockedChoice(value: string): ParsedUnlockedChoice | null {
  const match = value.trim().match(/^(.+?)\s*-\s*Level\s*(\d+)$/i);
  if (!match) return null;

  const type = Object.entries(choiceTitles).find(
    ([, title]) => title.replace(/^Select\s+/i, "") === match[1].trim(),
  )?.[0] as ChoiceType | undefined;

  if (!type) return null;

  return {
    type,
    title: choiceTitles[type],
    level: Number(match[2]),
  };
}

interface LevelCardProps {
  level: number;
}

export default function LevelCard({ level }: LevelCardProps) {
  const actions = getLevelActions(level);
  const { character } = useCharacter();
  const [modalRequest, setModalRequest] = useState<ModalRequest | null>(null);

  const closeModal = () => setModalRequest(null);

  const openChoiceModal = (
    type: ChoiceType,
    title: string,
    selectionKey: string,
    choiceLevel: number,
  ) => {
    setModalRequest({ type, title, selectionKey, level: choiceLevel });
  };

  const openActionModal = (action: string) => {
    const type = actionTypes[action];
    if (type === "baseStats") {
      setModalRequest({ type, title: action });
    } else if (type) {
      openChoiceModal(type, action, `${type}:${level}`, level);
    }
  };

  const getSelectedActionLabel = (action: string) => {
    const type = actionTypes[action];
    if (!type || type === "baseStats") return action;

    return character.selections[`${type}:${level}`] ?? action;
  };

  const hasChosenItem = (action: string) => {
    const type = actionTypes[action];
    if (!type || type === "baseStats") return false;

    return Boolean(character.selections[`${type}:${level}`]);
  };

  const getUnlockedChoices = (action: string): UnlockedChoice[] => {
    const type = actionTypes[action];
    if (!type || type === "baseStats") return [];

    const selectionKey = `${type}:${level}`;
    const selectedName = character.selections[selectionKey];
    if (!selectedName) return [];

    const selectedItem = unlockableData[type]?.find(
      (item) => item.name === selectedName,
    );
    if (!selectedItem?.unlockedFeats) return [];

    return selectedItem.unlockedFeats
      .split(",")
      .map(parseUnlockedChoice)
      .flatMap((choice, index) =>
        choice
          ? [
              {
                ...choice,
                selectionKey: `${selectionKey}:unlocked:${index}`,
              },
            ]
          : [],
      );
  };

  return (
    <div className="bg-blue-200 rounded-lg p-2 mb-3 shadow-sm border border-blue-300">
      <h3 className="text-xl font-bold text-gray-800 -mt-1.5 mb-1 text-center">
        Level {level}
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => {
          const isHighlighted = action === "Increase One Stat";
          const unlockedChoices = getUnlockedChoices(action);

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <OpenModalButton
                label={getSelectedActionLabel(action)}
                isHighlighted={isHighlighted}
                onClick={() => openActionModal(action)}
                itemChosen={hasChosenItem(action)}
                className={unlockedChoices.length > 0 ? "flex-1" : ""}
              />
              {unlockedChoices.map((choice) => {
                const selectedName = character.selections[choice.selectionKey];

                return (
                  <OpenModalButton
                    key={choice.selectionKey}
                    label={selectedName ?? choice.title}
                    itemChosen={Boolean(selectedName)}
                    onClick={() =>
                      openChoiceModal(
                        choice.type,
                        choice.title,
                        choice.selectionKey,
                        choice.level,
                      )
                    }
                    className="flex-1"
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {/* Modal Overlay */}
      {modalRequest && (
        <ModalWrapper request={modalRequest} closeModal={closeModal} />
      )}
    </div>
  );
}
