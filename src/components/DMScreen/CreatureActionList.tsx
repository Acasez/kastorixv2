import { useState, type FormEvent } from "react";
import type { ActionCost } from "../../types/Action";
import {
  getProficiency,
  signed,
  type ProficiencyTierName,
} from "../../constants/Proficiency";
import {
  useCreature,
  type CreatureAction,
} from "../../contexts/CreatureContext";
import type { StatKey } from "../../types/StatKey";
import { getActionIcons } from "../../utils/actionUtils";
import { MultiOptionSwitch } from "../Buttons/MultiOptionSwitch";
import ProficiencyMarker from "../Buttons/ProficiencyMarker";
import CreatureHeader from "./CreatureHeader";

type ActionDraft = Omit<CreatureAction, "id">;

const EMPTY_ACTION: ActionDraft = {
  name: "",
  actions: "1",
  stat: "PHY",
  proficiency: "Trained",
  trigger: "",
  requirement: "",
  description: "",
  traits: "",
};

const ACTION_COSTS: readonly ActionCost[] = ["0", "1", "2", "3", "R"];

export default function CreatureActionList() {
  const { creature, updateCreature } = useCreature();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ActionDraft>(EMPTY_ACTION);

  const resetEditor = () => {
    setDraft(EMPTY_ACTION);
    setEditingActionId(null);
    setIsEditorOpen(false);
  };

  const editAction = (action: CreatureAction) => {
    const { id, ...actionDraft } = action;
    setDraft(actionDraft);
    setEditingActionId(id);
    setIsEditorOpen(true);
  };

  const saveAction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) return;
    const actionDraft = { ...draft, name };

    if (editingActionId) {
      updateCreature({
        actions: creature.actions.map((action) =>
          action.id === editingActionId
            ? { ...actionDraft, id: action.id }
            : action,
        ),
      });
    } else {
      updateCreature({
        actions: [
          ...creature.actions,
          { ...actionDraft, id: crypto.randomUUID() },
        ],
      });
    }
    resetEditor();
  };

  const removeAction = (actionId: string) =>
    updateCreature({
      actions: creature.actions.filter((action) => action.id !== actionId),
    });

  const updateActionProficiency = (
    actionId: string,
    proficiency: ProficiencyTierName,
  ) =>
    updateCreature({
      actions: creature.actions.map((action) =>
        action.id === actionId ? { ...action, proficiency } : action,
      ),
    });

  const openNewAction = () => {
    if (isEditorOpen && !editingActionId) {
      resetEditor();
      return;
    }
    setDraft(EMPTY_ACTION);
    setEditingActionId(null);
    setIsEditorOpen(true);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-full">
          <CreatureHeader title="Actions" />
        </div>
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
          onClick={openNewAction}
          aria-label={
            isEditorOpen && !editingActionId ? "Cancel action" : "Add action"
          }
          title={
            isEditorOpen && !editingActionId ? "Cancel action" : "Add action"
          }
        >
          {isEditorOpen && !editingActionId ? "×" : "+"}
        </button>
      </div>

      {isEditorOpen && (
        <form
          className="space-y-3 rounded border border-stone-600 bg-stone-800 p-3"
          onSubmit={saveAction}
        >
          <label className="flex flex-col gap-1 text-sm font-semibold text-stone-200">
            <span>Action name</span>
            <input
              autoFocus
              required
              value={draft.name}
              onChange={(event) =>
                setDraft({ ...draft, name: event.target.value })
              }
              className="rounded border border-stone-500 bg-stone-900 px-2 py-1.5 font-normal text-white focus-visible:outline-2 focus-visible:outline-orange-400"
              placeholder="Action name"
            />
          </label>

          <div className="flex flex-wrap items-end gap-10 justify-between">
            <fieldset className="space-y-1">
              <legend className="text-sm font-semibold text-stone-200">
                Action cost
              </legend>
              <MultiOptionSwitch<ActionCost>
                options={ACTION_COSTS}
                value={draft.actions}
                labels={{ "0": "Free", R: "Reaction" }}
                onChange={(actions) => setDraft({ ...draft, actions })}
              />
            </fieldset>

            <div className="flex flex-row justify-between gap-5">
              <label className="flex flex-col gap-1 text-sm font-semibold text-stone-200">
                <span>Scaling stat</span>
                <select
                  value={draft.stat}
                  onChange={(event) =>
                    setDraft({ ...draft, stat: event.target.value as StatKey })
                  }
                  className="h-8 rounded border border-red-500 bg-stone-900 px-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                >
                  {(["PHY", "DEX", "INT", "WIL"] as const).map((stat) => (
                    <option key={stat} value={stat}>
                      {stat}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-col gap-1 text-sm font-semibold text-stone-200">
                <span>Proficiency</span>
                <ProficiencyMarker
                  skillName={draft.name || "Action"}
                  proficiency={draft.proficiency}
                  onProficiencyChange={(proficiency) =>
                    setDraft({ ...draft, proficiency })
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(["trigger", "requirement"] as const).map((field) => (
              <label
                className="flex flex-col gap-1 text-sm font-semibold text-stone-200"
                key={field}
              >
                <span className="capitalize">{field}</span>
                <input
                  value={draft[field]}
                  onChange={(event) =>
                    setDraft({ ...draft, [field]: event.target.value })
                  }
                  className="rounded border border-stone-500 bg-stone-900 px-2 py-1.5 font-normal text-white focus-visible:outline-2 focus-visible:outline-orange-400"
                  placeholder={`${field} (optional)`}
                />
              </label>
            ))}
          </div>

          <label className="flex flex-col gap-1 text-sm font-semibold text-stone-200">
            <span>Description</span>
            <textarea
              required
              rows={4}
              value={draft.description}
              onChange={(event) =>
                setDraft({ ...draft, description: event.target.value })
              }
              className="resize-y rounded border border-stone-500 bg-stone-900 px-2 py-1.5 font-normal text-white focus-visible:outline-2 focus-visible:outline-orange-400"
              placeholder="Describe what the action does"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-stone-200">
            <span>Traits</span>
            <input
              value={draft.traits}
              onChange={(event) =>
                setDraft({ ...draft, traits: event.target.value })
              }
              className="rounded border border-stone-500 bg-stone-900 px-2 py-1.5 font-normal text-white focus-visible:outline-2 focus-visible:outline-orange-400"
              placeholder="Optional traits"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded border border-stone-500 px-3 py-1.5 text-sm text-stone-200 hover:bg-stone-700"
              onClick={resetEditor}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-bg-wood px-3 py-1.5 text-sm text-white hover:bg-bg-redwood"
            >
              {editingActionId ? "Save Changes" : "Add Action"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {creature.actions.map((action) => (
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
                    alt=""
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
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
