import { useState, type FormEvent } from "react";
import { useCreature } from "../../hooks/useCreature";
import type { CreaturePassive } from "../../stores/useCreatureStore";
import CreatureHeader from "./CreatureHeader";
import CreaturePassiveComponent from "./CreaturePassiveComponent";

type PassiveDraft = Omit<CreaturePassive, "id">;

const EMPTY_PASSIVE: PassiveDraft = {
  name: "",
  effect: "",
  traits: "",
};

export default function CreaturePassiveList() {
  const { creature, updateCreature } = useCreature();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPassiveId, setEditingPassiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PassiveDraft>(EMPTY_PASSIVE);

  const resetEditor = () => {
    setDraft(EMPTY_PASSIVE);
    setEditingPassiveId(null);
    setIsEditorOpen(false);
  };

  const editPassive = (passive: CreaturePassive) => {
    const { id, ...passiveDraft } = passive;
    setDraft(passiveDraft);
    setEditingPassiveId(id);
    setIsEditorOpen(true);
  };

  const savePassive = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) return;
    const passiveDraft = { ...draft, name };

    if (editingPassiveId) {
      updateCreature({
        passives: creature.passives.map((passive) =>
          passive.id === editingPassiveId
            ? { ...passiveDraft, id: passive.id }
            : passive,
        ),
      });
    } else {
      updateCreature({
        passives: [
          ...creature.passives,
          { ...passiveDraft, id: crypto.randomUUID() },
        ],
      });
    }
    resetEditor();
  };

  const openNewPassive = () => {
    if (isEditorOpen && !editingPassiveId) {
      resetEditor();
      return;
    }
    setDraft(EMPTY_PASSIVE);
    setEditingPassiveId(null);
    setIsEditorOpen(true);
  };

  const removePassive = (passiveId: string) =>
    updateCreature({
      passives: creature.passives.filter((passive) => passive.id !== passiveId),
    });

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-full">
          <CreatureHeader title="Passives" />
        </div>
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
          onClick={openNewPassive}
          aria-label={
            isEditorOpen && !editingPassiveId ? "Cancel passive" : "Add passive"
          }
          title={
            isEditorOpen && !editingPassiveId ? "Cancel passive" : "Add passive"
          }
        >
          {isEditorOpen && !editingPassiveId ? "×" : "+"}
        </button>
      </div>

      {isEditorOpen && (
        <form
          className="space-y-3 rounded border border-stone-600 bg-stone-800 p-3"
          onSubmit={savePassive}
        >
          <label className="flex flex-col gap-1 text-sm font-semibold text-stone-200">
            <span>Passive name</span>
            <input
              autoFocus
              required
              value={draft.name}
              onChange={(event) =>
                setDraft({ ...draft, name: event.target.value })
              }
              className="rounded border border-stone-500 bg-stone-900 px-2 py-1.5 font-normal text-white focus-visible:outline-2 focus-visible:outline-orange-400"
              placeholder="Passive name"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-stone-200">
            <span>Effect</span>
            <textarea
              required
              rows={4}
              value={draft.effect}
              onChange={(event) =>
                setDraft({ ...draft, effect: event.target.value })
              }
              className="resize-y rounded border border-stone-500 bg-stone-900 px-2 py-1.5 font-normal text-white focus-visible:outline-2 focus-visible:outline-orange-400"
              placeholder="Describe the passive effect"
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
              {editingPassiveId ? "Save Changes" : "Add Passive"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {creature.passives.map((passive) => (
          <CreaturePassiveComponent
            passive={passive}
            editPassive={editPassive}
            removePassive={removePassive}
          />
        ))}
      </div>
    </section>
  );
}
