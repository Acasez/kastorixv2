import ActionBox from "../ActionBox";
import actions from "../../json/actions.json";
import type { ChoiceItem } from "./ChoiceModal";

interface ChoiceTooltipProps {
  item: ChoiceItem;
}

export default function ChoiceTooltip({ item }: ChoiceTooltipProps) {
  return (
    <div className="w-96 max-w-[calc(100vw-2rem)] text-center">
      <h3 className="mb-2 text-base font-normal text-yellow-300 underline">
        {item.name}
      </h3>
      {item.actionIcons && item.actionIcons.length > 0 && (
        <p className="mb-1 flex justify-center">
          {item.actionIcons.map((icon, index) => (
            <img
              key={`${item.name}-action-${index}`}
              src={icon}
              alt=""
              aria-hidden="true"
              className="w-5 h-5 object-contain"
            />
          ))}
        </p>
      )}
      {item.details?.map((detail) => (
        <p key={detail.label} className="whitespace-pre-line">
          <strong>{detail.label}:</strong>{" "}
          {detail.italicFirstLine
            ? (() => {
                const [firstLine, ...remainingLines] = detail.value.split("\n");
                return (
                  <>
                    <span className="italic">{firstLine}</span>
                    {remainingLines.length > 0 &&
                      `\n${remainingLines.join("\n")}`}
                  </>
                );
              })()
            : detail.value}
        </p>
      ))}
      {item.unlockedAction && (
        <ActionBox action={item.unlockedAction} actionsList={actions} />
      )}
    </div>
  );
}
