import { getActionIcons } from "../../utils/actionUtils";
import ActionIcon from "../Actions/ActionIcon";
import Tooltip from "../Tooltip";
import TraitComponent from "./TraitComponent";
import type { Action } from "../../types/Action";

interface TechniqueComponentProps {
  technique: Action;
  onReplaceTechnique: (rankName: string, techniqueName: string) => void;
  onRemoveTechnique: (techniqueName: string) => void;
  rankName: string;
}

export default function TechniqueComponent({
  technique: technique,
  onReplaceTechnique,
  onRemoveTechnique,
  rankName,
}: TechniqueComponentProps) {
  return (
    <Tooltip
      key={technique.name}
      content={
        <div className="w-96 max-w-[calc(100vw-2rem)] text-center">
          <h3 className="mb-2 text-base font-normal text-yellow-300 underline">
            {technique.name}
          </h3>
          <p className="flex justify-center">
            <strong>Actions:</strong>{" "}
            {getActionIcons(technique.actions).map((icon, index) => (
              <ActionIcon
                icon={icon}
                key={`${technique.name}-action-${index}`}
              />
            ))}
          </p>
          <p>
            <strong>Traits:</strong>{" "}
            {technique.traits?.map((a) => a.name).join(", ")}
          </p>
          <p className="mt-2 ">
            <strong>Description:</strong> {technique.description}
          </p>
          <p>
            <strong>Rank:</strong> {technique.techniqueRank}
          </p>
        </div>
      }
      contentClassName="whitespace-normal"
    >
      <div
        key={technique.name}
        role="button"
        tabIndex={0}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          onReplaceTechnique(rankName, technique.name);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            onReplaceTechnique(rankName, technique.name);
          }
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          if ((event.target as HTMLElement).closest("button")) return;
          onRemoveTechnique(technique.name);
        }}
        className={
          "flex flex-col gap-1 border border-gray-400 rounded px-2 py-1"
        }
      >
        <div className="flex items-center gap-1">
          <span>{technique.name}</span>
          {getActionIcons(technique.actions).map((icon, index) => (
            <ActionIcon icon={icon} key={`${technique.name}-action-${index}`} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {technique.traits.map((trait) => (
            <TraitComponent
              trait={trait}
              key={trait.name}
              className="flex-1 text-center"
            />
          ))}
        </div>
      </div>
    </Tooltip>
  );
}
