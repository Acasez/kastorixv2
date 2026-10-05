// src/components/ActionBox.tsx
import { useMemo } from "react";
import { getActionIcons } from "../utils/actionUtils";

interface Action {
  name: string;
  actions: string;
  trigger: string;
  description: string;
  traits: string;
}

interface ActionBoxProps {
  action: string;
  actionsList: Action[];
}

export default function ActionBox({ action, actionsList }: ActionBoxProps) {
  // ✅ Step 1: Memoize actionDetails FIRST (before any returns)
  const actionDetails = useMemo(() => {
    return actionsList.find((item) => item.name === action);
  }, [action, actionsList]);

  // ✅ Step 2: Memoize all derived data together
  const { formattedDescription, widthClass, actionIcons } = useMemo(() => {
    if (!actionDetails) {
      return { formattedDescription: null, widthClass: "", actionIcons: [] };
    }

    const wordCount = actionDetails.description.split(/\s+/).length;
    return {
      formattedDescription: actionDetails.description
        .split("\n")
        .map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        )),
      widthClass: wordCount > 40 ? "max-w-[420px]" : "max-w-[250px]",
      actionIcons: getActionIcons(actionDetails.actions),
    };
  }, [actionDetails]); // Only recalculates when actionDetails changes

  // ✅ Step 3: NOW we can do conditional rendering
  if (!actionDetails) {
    return (
      <div className="mb-3.75 ml-3.75 p-2.5 border border-amber-800 bg-bg-rules font-serif max-w-62.5 self-center grid">
        Action not found: {action}
      </div>
    );
  }

  // ✅ Step 4: Main render (all hooks already called)
  return (
    <div
      className={`mb-3.75 ml-3.75 p-2.5 border border-amber-800 bg-bg-rules font-serif text-text-black ${widthClass} self-center grid`}
    >
      <div className="flex items-center gap-2.5 mb-2.5 justify-self-center">
        <h2 className="underline text-[28px]">{action}</h2>
        <div className="max-w-8 max-h-8 flex flex-row">
          {actionIcons.map((icon, i) => (
            <img
              key={i}
              src={icon}
              alt={`${actionDetails.actions} action cost`}
              className="w-6 h-6"
            />
          ))}
        </div>
      </div>
      <div className="text-center text-base">
        {actionDetails.trigger && (
          <p>
            <span className="font-bold">Trigger</span>: {actionDetails.trigger}
          </p>
        )}
        <p className="mt-2.5 leading-normal">{formattedDescription}</p>
        {actionDetails.traits && (
          <p className="italic text-[#666] mt-2.5">
            Traits: {actionDetails.traits}
          </p>
        )}
      </div>
    </div>
  );
}
