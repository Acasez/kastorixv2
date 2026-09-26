import type { Gadget } from "../../../types/Gadgets";

interface GadgetComponentProps {
  gadget: Gadget;
  onReplaceGadget: (gadgetName: string) => void;
  onRemoveGadget: (gadgetName: string) => void;
}

export default function GadgetComponent({
  gadget,
  onReplaceGadget,
  onRemoveGadget,
}: GadgetComponentProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onReplaceGadget(gadget.name)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onReplaceGadget(gadget.name);
        }
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        onRemoveGadget(gadget.name);
      }}
      aria-label={`${gadget.name}. Click to replace or right-click to remove.`}
      className="flex w-full cursor-pointer flex-col gap-2 rounded-lg border border-gray-500 bg-gray-800 px-3 py-2 text-left shadow-sm transition-colors hover:border-gray-300"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-base font-semibold text-white">
          {gadget.name}
        </span>
        <span className="text-sm text-gray-300">
          Type <strong className="text-white">{gadget.type}</strong>
        </span>
        <span className="text-sm text-gray-300">
          Level <strong className="text-white">{gadget.level}</strong>
        </span>
        {gadget.requirement && (
          <span className="text-sm text-gray-300">
            Requirement{" "}
            <strong className="text-white">{gadget.requirement}</strong>
          </span>
        )}
      </div>
      <p className="whitespace-pre-line text-sm text-gray-300">
        {gadget.effect}
      </p>
    </div>
  );
}
