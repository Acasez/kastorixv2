import type { CreaturePassive } from "../../stores/useCreatureStore";

interface CreaturePassiveComponentProps {
  passive: CreaturePassive;
  editPassive: (action: CreaturePassive) => void;
  removePassive: (actionId: string) => void;
}

export default function CreaturePassiveComponent({
  passive,
  editPassive,
  removePassive,
}: CreaturePassiveComponentProps) {
  return (
    <article
      className="rounded border border-stone-600 bg-stone-800 text-stone-200"
      key={passive.id}
    >
      <header className="flex flex-wrap items-center gap-2 border-b border-stone-700 px-3 py-2">
        <h3 className="min-w-0 flex-1 font-semibold text-white">
          {passive.name}
        </h3>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs text-stone-300 hover:bg-stone-700 hover:text-white"
          onClick={() => editPassive(passive)}
        >
          Edit
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs text-red-300 hover:bg-red-950 hover:text-red-200"
          onClick={() => removePassive(passive.id)}
          aria-label={`Remove ${passive.name}`}
        >
          Remove
        </button>
      </header>
      <div className="space-y-2 px-3 py-2 text-sm leading-5">
        <p className="whitespace-pre-line">{passive.effect}</p>
        {passive.traits && (
          <p className="text-stone-400">
            <strong>Traits:</strong> {passive.traits}
          </p>
        )}
      </div>
    </article>
  );
}
