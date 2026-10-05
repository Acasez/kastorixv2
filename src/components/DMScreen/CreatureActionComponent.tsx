import {
  getProficiency,
  signed,
  type ProficiencyTierName,
} from "../../constants/Proficiency";
import type { Creature, CreatureAction } from "../../stores/useCreatureStore";
import { getActionIcons } from "../../utils/actionUtils";
import ProficiencyMarker from "../Buttons/ProficiencyMarker";

interface CreatureActionComponentProps {
  action: CreatureAction;
  creature: Creature;
  updateActionProficiency: (
    actionId: string,
    proficiency: ProficiencyTierName,
  ) => void;
  editAction: (action: CreatureAction) => void;
  removeAction: (actionId: string) => void;
}

export default function CreatureActionComponent({
  action,
  creature,
  updateActionProficiency,
  editAction,
  removeAction,
}: CreatureActionComponentProps) {
  return (
    <article
      className="rounded border border-stone-600 bg-stone-800 text-stone-200"
      key={action.id}
    >
      <header className="flex flex-wrap items-center gap-2 border-b border-stone-700 px-3 py-2">
        <span
          className="flex items-center gap-1"
          aria-label={`${action.actions} action cost`}
        >
          {getActionIcons(action.actions).map((icon, index) => (
            <img
              key={`${action.id}-cost-${index}`}
              src={icon}
              alt={action.actions}
              aria-hidden="true"
              className="size-5 object-contain"
            />
          ))}
        </span>
        <h3 className="min-w-0 flex-1 font-semibold text-white">
          {action.name}
        </h3>
        <span className="text-sm font-semibold text-stone-300">
          {action.stat}{" "}
          {signed(
            creature.stats[action.stat] +
              getProficiency(action.proficiency).bonus,
          )}
        </span>
        <ProficiencyMarker
          skillName={action.name}
          proficiency={action.proficiency}
          onProficiencyChange={(proficiency) =>
            updateActionProficiency(action.id, proficiency)
          }
        />
        <button
          type="button"
          className="rounded px-2 py-1 text-xs text-stone-300 hover:bg-stone-700 hover:text-white"
          onClick={() => editAction(action)}
        >
          Edit
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs text-red-300 hover:bg-red-950 hover:text-red-200"
          onClick={() => removeAction(action.id)}
          aria-label={`Remove ${action.name}`}
        >
          Remove
        </button>
      </header>
      <div className="space-y-2 px-3 py-2 text-sm leading-5">
        {action.trigger && (
          <p>
            <strong>Trigger:</strong> {action.trigger}
          </p>
        )}
        {action.requirement && (
          <p>
            <strong>Requirement:</strong> {action.requirement}
          </p>
        )}
        <p className="whitespace-pre-line">{action.description}</p>
        {action.traits && (
          <p className="text-stone-400">
            <strong>Traits:</strong> {action.traits}
          </p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-stone-300">
          {action.manaCost > 0 && (
            <p>
              <strong>Mana cost:</strong> {action.manaCost}
            </p>
          )}
          {action.cooldown && (
            <p>
              <strong>Cooldown:</strong> {action.cooldown}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
