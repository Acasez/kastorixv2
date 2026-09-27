import type { ActionData } from "../../../types/Action";
import { getActionIcons } from "../../../utils/actionUtils";

interface ActionRowProps {
  action: ActionData;
  isExpanded: boolean;
  onToggle: (name: string) => void;
}

export default function ActionRow({
  action,
  isExpanded,
  onToggle,
}: ActionRowProps) {
  const actionIcons = getActionIcons(action.actions);

  return (
    <article>
      <button
        type="button"
        onClick={() => onToggle(action.name)}
        aria-expanded={isExpanded}
        className="flex w-full items-center gap-3 px-2 py-3 text-left hover:bg-[#293340]"
      >
        <span className="flex min-w-20 items-center gap-1">
          {actionIcons.map((icon, index) => (
            <img
              key={`${action.name}-${index}`}
              src={icon}
              alt=""
              className="h-5 w-5 object-contain"
            />
          ))}
        </span>
        <span className="flex-1 font-semibold">{action.name}</span>
        <span className="text-sm text-gray-400">{action.actions}</span>
        <span aria-hidden="true" className="text-gray-400">
          {isExpanded ? "-" : "+"}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-[#343d49] bg-[#242b34] px-5 py-4 text-sm leading-6 text-gray-200">
          {action.trigger && (
            <p>
              <strong className="text-white">Trigger:</strong> {action.trigger}
            </p>
          )}
          {action.requirement && (
            <p>
              <strong className="text-white">Requirement:</strong>{" "}
              {action.requirement}
            </p>
          )}
          <div className="mt-2 whitespace-pre-line">{action.description}</div>
          {action.traits && (
            <p className="mt-3 text-gray-400">
              <strong className="text-gray-300">Traits:</strong> {action.traits}
            </p>
          )}
          {action.sourceType !== "Base" && action.source && (
            <p className="mt-2 text-gray-400">
              Source: {action.sourceType} - {action.source}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
