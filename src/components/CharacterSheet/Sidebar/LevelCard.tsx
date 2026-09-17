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
import backgrounds from "../../../JSON/backgrounds.json";

type ChoiceType = Exclude<ModalRequest["type"], "species" | "baseStats">;

type UnlockableItem = {
  name: string;
  unlockedFeats?: string;
  generalFeat?: string;
};

type UnlockedChoice = {
  type: ChoiceType;
  title: string;
  level: number;
  selectionKey: string;
  fixedValue?: string;
};

type ParsedUnlockedChoice = Omit<UnlockedChoice, "selectionKey">;

type ChoiceNode = UnlockedChoice & {
  children: ChoiceNode[];
};

const MAX_UNLOCK_DEPTH = 3;

const unlockableData: Record<string, UnlockableItem[]> = {
  generalFeat: generalFeats,
  arcaneFeat: arcaneFeats,
  advantage: advantages,
  ancestryFeat: ancestryFeats,
  background: backgrounds,
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
  const { character, updateCharacter } = useCharacter();
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

  const clearSelection = (selectionKey: string, type: ChoiceType) => {
    const selections = Object.fromEntries(
      Object.entries(character.selections).filter(
        ([key]) =>
          key !== selectionKey && !key.startsWith(`${selectionKey}:unlocked:`),
      ),
    );

    updateCharacter({
      selections,
      ...(type === "background" ? { background: null } : {}),
    });
  };

  const handleContextMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    selectionKey: string,
    type: ChoiceType,
  ) => {
    event.preventDefault();
    clearSelection(selectionKey, type);
  };

  const openActionModal = (action: string) => {
    const type = actionTypes[action];
    if (type === "baseStats") {
      setModalRequest({ type, title: action });
    } else if (type) {
      openChoiceModal(type, action, `${type}:${level}`, level);
    }
  };

  const getSelectionKey = (type: ChoiceType, parentLevel = level) =>
    `${type}:${parentLevel}`;

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

  const getUnlockedChoices = (
    type: ChoiceType,
    selectionKey: string,
    selectedName: string,
    parentDepth: number,
  ): ChoiceNode[] => {
    if (parentDepth >= MAX_UNLOCK_DEPTH) return [];

    const selectedItem = unlockableData[type]?.find(
      (item) => item.name === selectedName,
    );
    if (!selectedItem) return [];

    const choices: UnlockedChoice[] = [];
    if (type === "background" && selectedItem.generalFeat) {
      choices.push({
        type: "generalFeat",
        title: "Select General Feat",
        level: 1,
        selectionKey: `${selectionKey}:unlocked:0`,
        fixedValue: selectedItem.generalFeat,
      });
    } else if (selectedItem.unlockedFeats) {
      selectedItem.unlockedFeats
        .split(",")
        .map(parseUnlockedChoice)
        .forEach((choice, index) => {
          if (choice) {
            choices.push({
              ...choice,
              selectionKey: `${selectionKey}:unlocked:${index}`,
            });
          }
        });
    }

    return choices.map((choice) => {
      const childSelectedName =
        character.selections[choice.selectionKey] ?? choice.fixedValue;

      return {
        ...choice,
        children: childSelectedName
          ? getUnlockedChoices(
              choice.type,
              choice.selectionKey,
              childSelectedName,
              parentDepth + 1,
            )
          : [],
      };
    });
  };

  const getActionUnlockedChoices = (action: string) => {
    const type = actionTypes[action];
    if (!type || type === "baseStats") return [];

    const selectionKey = getSelectionKey(type);
    const selectedName = character.selections[selectionKey];
    return selectedName
      ? getUnlockedChoices(type, selectionKey, selectedName, 0)
      : [];
  };

  const renderUnlockedChoice = (choice: ChoiceNode, depth: number) => {
    const selectedName =
      character.selections[choice.selectionKey] ?? choice.fixedValue;

    return (
      <div key={choice.selectionKey} className="space-y-1">
        <OpenModalButton
          label={selectedName ?? choice.title}
          itemChosen={Boolean(selectedName)}
          onClick={
            choice.fixedValue
              ? undefined
              : () =>
                  openChoiceModal(
                    choice.type,
                    choice.title,
                    choice.selectionKey,
                    choice.level,
                  )
          }
          onContextMenu={
            choice.fixedValue
              ? undefined
              : (event) =>
                  handleContextMenu(event, choice.selectionKey, choice.type)
          }
          fixedChoice={choice.fixedValue != undefined}
        />
        {choice.children.length > 0 && (
          <div
            className="ml-6 pl-2 border-l-2 border-teal-700 space-y-1"
            data-unlock-depth={depth + 1}
          >
            {choice.children.map((child) =>
              renderUnlockedChoice(child, depth + 1),
            )}
          </div>
        )}
      </div>
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
          const unlockedChoices = getActionUnlockedChoices(action);

          return (
            <div key={index} className="flex flex-col gap-1">
              <OpenModalButton
                label={getSelectedActionLabel(action)}
                isHighlighted={isHighlighted}
                onClick={() => openActionModal(action)}
                itemChosen={hasChosenItem(action)}
                onContextMenu={(event) => {
                  const type = actionTypes[action];
                  if (type && type !== "baseStats") {
                    handleContextMenu(event, `${type}:${level}`, type);
                  }
                }}
              />
              {unlockedChoices.length > 0 && (
                <div className="ml-6 pl-2 border-l-2 border-teal-700 space-y-1">
                  {unlockedChoices.map((choice) =>
                    renderUnlockedChoice(choice, 1),
                  )}
                </div>
              )}
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
