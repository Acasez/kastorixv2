import OpenModalButton from "../OpenModalButton";
import type { ModalRequest } from "../../ModalViews/modalTypes";
import { getLevelActions } from "../../../utils/LevelCardUtils";
import { useCharacter } from "../../../hooks/useCharacter";
import generalFeats from "../../../data/generalFeats";
import arcaneFeats from "../../../data/arcaneFeats";
import advantages from "../../../data/advantages";
import ancestryFeats from "../../../data/ancestryFeats";
import backgrounds from "../../../data/backgrounds";
import golemUpgrades from "../../../data/golemModels";
import runegunUpgrades from "../../../data/runegunUpgrades";
import spells from "../../../data/spells";
import weapons from "../../../data/weapons";
import metamagics from "../../../data/metamagics";
import armors from "../../../data/armors";
import gadgets from "../../../data/gadgets";
import ChoiceTooltip from "../../ModalViews/ChoiceTooltip";
import { getChoiceItem } from "../../ModalViews/choiceData";
import { useModal } from "../../../hooks/useModal";
import type {
  Advantage,
  AncestryFeat,
  ArcaneFeat,
  GeneralFeat,
} from "../../../types/Feats";

type ChoiceType = Exclude<
  ModalRequest["type"],
  "species" | "baseStats" | "statIncrease"
>;

type UnlockableItem = {
  name: string;
  unlockedFeats?: string; // Keep as string for now, or make it generic
  generalFeat?: GeneralFeat | null;
  choice?: string;
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

const choiceConfig: Record<
  ChoiceType,
  { title: string; items: UnlockableItem[] }
> = {
  Background: { title: "Select Background", items: backgrounds },
  "General Feat": { title: "Select General Feat", items: generalFeats },
  arcaneFeat: { title: "Select Arcane Feat", items: arcaneFeats },
  advantage: { title: "Select Advantage", items: advantages },
  ancestryFeat: { title: "Select Ancestry Feat", items: ancestryFeats },
  golemUpgrade: { title: "Select Golem Upgrade", items: golemUpgrades },
  runegunUpgrade: {
    title: "Select Runegun Upgrade",
    items: runegunUpgrades,
  },
  spell: { title: "Select Spell", items: spells },
  weapon: { title: "Select Weapon", items: weapons },
  metamagic: { title: "Select Metamagic", items: metamagics },
  armor: { title: "Select Armor", items: armors },
  gadget: { title: "Select Gadget", items: gadgets },
};

const actionTypes: Record<string, ChoiceType | "baseStats" | "statIncrease"> = {
  "Select Background": "Background",
  "Select Advantage": "Advantage",
  "Select Ancestry Feat": "Ancestry Feat",
  "Select Arcane Feat": "Arcane Feat",
  "Select General Feat": "General Feat",
  "Increase One Stat": "statIncrease",
};

function parseUnlockedChoice(
  value: string,
  fallbackLevel: number,
): ParsedUnlockedChoice | null {
  const match = value.trim().match(/^(.+?)\s*-\s*Level\s*(\d+|X)$/i);
  if (!match) return null;

  const type = Object.entries(choiceConfig).find(
    ([, config]) => config.title.replace(/^Select\s+/i, "") === match[1].trim(),
  )?.[0] as ChoiceType | undefined;

  if (!type) return null;

  return {
    type,
    title: choiceConfig[type].title,
    level: match[2].toUpperCase() === "X" ? fallbackLevel : Number(match[2]),
  };
}

function parseUnlockedChoiceFromFeat(
  feat: AncestryFeat | Advantage | GeneralFeat | ArcaneFeat,
  fallbackLevel: number,
): ParsedUnlockedChoice | null {
  if (!feat.unlockedFeats) return null;

  // Parse the unlockedFeats string to determine type and level
  const match = feat.unlockedFeats
    .trim()
    .match(/^(.+?)\s*-\s*Level\s*(\d+|X)$/i);
  if (!match) return null;

  const type = Object.entries(choiceConfig).find(
    ([, config]) => config.title.replace(/^Select\s+/i, "") === match[1].trim(),
  )?.[0] as ChoiceType | undefined;

  if (!type) return null;

  return {
    type,
    title: choiceConfig[type].title,
    level: match[2].toUpperCase() === "X" ? fallbackLevel : Number(match[2]),
  };
}

interface LevelCardProps {
  level: number;
}

export default function LevelCard({ level }: LevelCardProps) {
  const actions = getLevelActions(level);
  const { character, updateCharacter } = useCharacter();
  const { openModal } = useModal();

  const openChoiceModal = (
    type: ChoiceType,
    title: string,
    selectionKey: string,
    choiceLevel: number,
  ) => {
    if (type === "Ancestry Feat") {
      openModal({
        type,
        title,
        selectionKey,
        level: choiceLevel,
        species: character.species,
      });
      return;
    }

    openModal({ type, title, selectionKey, level: choiceLevel });
  };

  const clearSelection = (selectionKey: string, type: ChoiceType) => {
    const selectedItem = choiceConfig[type].items.find(
      (item) => item.name === character.selections[selectionKey],
    );
    const selections = Object.fromEntries(
      Object.entries(character.selections).filter(
        ([key]) =>
          key !== selectionKey &&
          key !== `${selectionKey}:choice` &&
          !key.startsWith(`${selectionKey}:unlocked:`),
      ),
    );

    updateCharacter({
      selections,
      ...(type === "Advantage" &&
      selectedItem?.choice === "Golem Model - Choice"
        ? { golem: null }
        : {}),
      ...(type === "Background" ? { background: null } : {}),
    });
  };

  const clearStatIncrease = (selectionKey: string) => {
    const selectedStat = character.selections[selectionKey];
    if (!selectedStat || !["PHY", "DEX", "INT", "WIL"].includes(selectedStat)) {
      return;
    }

    const selections = Object.fromEntries(
      Object.entries(character.selections).filter(
        ([key]) => key !== selectionKey,
      ),
    );

    updateCharacter({
      baseStats: {
        ...character.baseStats,
        [selectedStat]:
          (character.baseStats[
            selectedStat as keyof typeof character.baseStats
          ] ?? 0) - 1,
      },
      selections,
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
      openModal({ type, title: action });
    } else if (type === "statIncrease") {
      openModal({
        type,
        title: action,
        selectionKey: `${type}:${level}`,
        level,
      });
    } else if (type) {
      openChoiceModal(type, action, `${type}:${level}`, level);
    }
  };

  const getSelectionKey = (type: ChoiceType, parentLevel = level) =>
    `${type}:${parentLevel}`;

  const getSelectedActionLabel = (action: string) => {
    const type = actionTypes[action];
    if (!type || type === "baseStats") return action;

    const selectionKey = `${type}:${level}`;
    const selectedName = character.selections[selectionKey] ?? action;
    const selectedChoice = character.selections[`${selectionKey}:choice`];

    return selectedChoice
      ? `${selectedName} - ${selectedChoice}`
      : selectedName;
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

    const selectedItem = choiceConfig[type].items.find(
      (item) => item.name === selectedName,
    );
    if (!selectedItem) return [];

    const choices: UnlockedChoice[] = [];
    if (type === "Background" && selectedItem.generalFeat) {
      choices.push({
        type: "General Feat",
        title: "Select General Feat",
        level: 1,
        selectionKey: `${selectionKey}:unlocked:0`,
        fixedValue: selectedItem.generalFeat.name,
      });
    } else if (selectedItem.unlockedFeats) {
      // Handle both string and typed array of feats
      const unlockedFeatsList =
        typeof selectedItem.unlockedFeats === "string"
          ? selectedItem.unlockedFeats.split(",")
          : [selectedItem.unlockedFeats];

      unlockedFeatsList
        .map((unlockedFeat) => {
          if (typeof unlockedFeat === "string") {
            return parseUnlockedChoice(unlockedFeat, level);
          }
          // If it's already typed, extract the info
          return parseUnlockedChoiceFromFeat(unlockedFeat, level);
        })
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
    if (!type || type === "baseStats" || type === "statIncrease") return [];

    const selectionKey = getSelectionKey(type);
    const selectedName = character.selections[selectionKey];
    return selectedName
      ? getUnlockedChoices(type, selectionKey, selectedName, 0)
      : [];
  };

  const renderUnlockedChoice = (choice: ChoiceNode, depth: number) => {
    const selectedName =
      character.selections[choice.selectionKey] ?? choice.fixedValue;
    const selectedChoice =
      character.selections[`${choice.selectionKey}:choice`];
    const label = selectedName
      ? `${selectedName}${selectedChoice ? ` - ${selectedChoice}` : ""}`
      : choice.title;

    return (
      <div key={choice.selectionKey} className="space-y-1">
        <OpenModalButton
          label={label}
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
          tooltipContent={
            selectedName
              ? (() => {
                  const item = getChoiceItem(choice.type, selectedName);
                  return item ? <ChoiceTooltip item={item} /> : undefined;
                })()
              : undefined
          }
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
          const unlockedChoices = getActionUnlockedChoices(action);

          return (
            <div key={index} className="flex flex-col gap-1">
              <OpenModalButton
                label={getSelectedActionLabel(action)}
                onClick={() => openActionModal(action)}
                itemChosen={hasChosenItem(action)}
                onContextMenu={(event) => {
                  const type = actionTypes[action];
                  if (type === "statIncrease") {
                    event.preventDefault();
                    clearStatIncrease(`${type}:${level}`);
                  } else if (type && type !== "baseStats") {
                    handleContextMenu(event, `${type}:${level}`, type);
                  }
                }}
                tooltipContent={(() => {
                  const selectedName = getSelectedActionLabel(action);
                  const type = actionTypes[action];
                  if (
                    !type ||
                    type === "baseStats" ||
                    type === "statIncrease" ||
                    !hasChosenItem(action)
                  ) {
                    return undefined;
                  }
                  const item = getChoiceItem(type, selectedName);
                  return item ? <ChoiceTooltip item={item} /> : undefined;
                })()}
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
    </div>
  );
}
