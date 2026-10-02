import CreatureHeader from "./CreatureHeader";

type CreatureSectionHeaderProps = {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
};

export default function CreatureSectionHeader({
  title,
  onAdd,
  addLabel = "Add",
}: CreatureSectionHeaderProps) {
  return (
    <div className="relative">
      <CreatureHeader title={title} />
      {onAdd && (
        <button
          type="button"
          className="absolute right-0 top-0 flex size-8 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
          onClick={onAdd}
          aria-label={addLabel}
          title={addLabel}
        >
          +
        </button>
      )}
    </div>
  );
}
