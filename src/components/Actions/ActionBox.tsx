import { getActionIcons } from "../../utils/actionUtils";
import ActionIcon from "./ActionIcon";
import actions from "../../data/actions";

interface ActionBoxProps {
  action: string;
}

const boxClass =
  "mb-3.75 ml-3.75 p-2.5 border border-bg-redwood bg-bg-rules font-serif self-center grid justify-items-center";

export default function ActionBox({ action }: ActionBoxProps) {
  const details = actions.find((item) => item.name === action);

  if (!details) {
    return (
      <div className={`${boxClass} max-w-62.5`}>Action not found: {action}</div>
    );
  }

  return (
    <div className={`${boxClass} text-text-black shrink-0 w-auto max-w-100`}>
      <div className="flex items-center gap-2.5 mb-2.5">
        <h2 className="underline text-[28px] whitespace-nowrap">{action}</h2>
        <div className="max-w-8 max-h-8 flex flex-row">
          {getActionIcons(details.actions).map((icon, i) => (
            <ActionIcon icon={icon} key={i} />
          ))}
        </div>
      </div>
      <div className="text-center text-base max-w-full">
        <div className="flex flex-row justify-center gap-5">
          {details.manaCost && details.manaCost > 0 && (
            <p>
              <span className="font-bold">Mana cost</span>: {details.manaCost}
            </p>
          )}
          {details.focusCost && details.focusCost > 0 && (
            <p>
              <span className="font-bold">Focus point cost</span>:{" "}
              {details.focusCost}
            </p>
          )}
        </div>
        {details.trigger && (
          <p>
            <span className="font-bold">Trigger</span>: {details.trigger}
          </p>
        )}
        <p className="mt-2.5 leading-normal whitespace-pre-line">
          {details.description}
        </p>
        {details.traits && (
          <p className="italic text-text-trait mt-2.5">
            Traits: {details.traits}
          </p>
        )}
      </div>
    </div>
  );
}
