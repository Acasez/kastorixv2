import type { Metamagic } from "../../../types/Spells";
import Tooltip from "../../Tooltip";

interface MetamagicComponentProps {
  metamagic: Metamagic;
  onReplaceMetamagic: (metamagicName: string) => void;
  onRemoveMetamagic: (metamagicName: string) => void;
}

export default function MetamagicComponent({
  metamagic,
  onReplaceMetamagic,
  onRemoveMetamagic,
}: MetamagicComponentProps) {
  return (
    <Tooltip
      key={metamagic.name}
      content={
        <div className="w-70 max-w-[calc(100vw-2rem)] text-center">
          <h3 className="mb-2 text-base font-normal text-yellow-300 underline">
            {metamagic.name}
          </h3>
          {metamagic.spellType && (
            <p>
              <strong>Type:</strong> {metamagic.spellType}
            </p>
          )}
          <p className="mt-2 whitespace-pre-line">
            <strong>Effect:</strong> {metamagic.effect}
          </p>
          <p className="mt-2 whitespace-pre-line">
            <strong>DC Increase:</strong> {metamagic.dc}
          </p>
          <p>
            <strong>Level:</strong> {metamagic.level}
          </p>
        </div>
      }
      contentClassName="whitespace-normal"
    >
      <div
        key={metamagic.name}
        role="button"
        tabIndex={0}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          onReplaceMetamagic(metamagic.name);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            onReplaceMetamagic(metamagic.name);
          }
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          if ((event.target as HTMLElement).closest("button")) return;
          onRemoveMetamagic(metamagic.name);
        }}
        className="flex items-center gap-1 border border-gray-400 rounded px-2 py-1"
      >
        <span>{metamagic.name}</span>
      </div>
    </Tooltip>
  );
}
