import type { SetStateAction } from "react";
import ActionBox from "../Actions/ActionBox";
import type { ChoiceItem } from "./ChoiceModal";
import ActionIcon from "../Actions/ActionIcon";

interface ChoiceItemDetailProps {
  selectedItem: ChoiceItem | undefined;
  selectedChoiceName: string;
  setSelectedChoiceName: (value: SetStateAction<string>) => void;
  selectedChoice: ChoiceItem | undefined;
  isDisabled: (item: ChoiceItem) => boolean;
  onConfirm: (value: string, choice?: string | undefined) => void;
  confirmLabel: string;
}

export default function ChoiceItemDetail({
  selectedItem,
  selectedChoiceName,
  setSelectedChoiceName,
  selectedChoice,
  isDisabled,
  onConfirm,
  confirmLabel,
}: ChoiceItemDetailProps) {
  return (
    <>
      <div className="border-amber-200 border-2 p-3 flex-1 overflow-hidden  text-text-black">
        {selectedItem ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl underline">{selectedItem.name}</h3>
              {selectedItem.actionIcons?.map((icon, index) => (
                <ActionIcon
                  icon={icon}
                  key={`${selectedItem.name}-detail-action-${index}`}
                />
              ))}
            </div>
            <div className="mt-3 flex-1 overflow-y-auto">
              {selectedItem.details ? (
                selectedItem.details.map((detail) => {
                  const [firstLine, ...remainingLines] =
                    detail.valueKey.split("\n");
                  return (
                    <p key={detail.label} className="whitespace-pre-line">
                      {detail.flavor ? (
                        <>
                          <i>{detail.valueKey}</i>
                        </>
                      ) : (
                        <>
                          <span className="font-bold">{detail.label}:</span>{" "}
                          {detail.italicFirstLine ? (
                            <>
                              <span className="italic">{firstLine}</span>
                              {remainingLines.length > 0 &&
                                `\n${remainingLines.join("\n")}`}
                            </>
                          ) : (
                            detail.valueKey
                          )}
                        </>
                      )}
                    </p>
                  );
                })
              ) : (
                <p className="whitespace-pre-line">
                  {selectedItem.description ??
                    selectedItem.effect ??
                    "No description available."}
                </p>
              )}
              {selectedItem.choiceOptions && (
                <div className="mt-4">
                  <p className="font-bold">
                    Choose {selectedItem.choice?.replace(/\s*-\s*Choice$/i, "")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedItem.choiceOptions.map((choice) => (
                      <button
                        type="button"
                        key={choice.name}
                        className={`border-2 px-2 py-1 text-text-black ${
                          selectedChoiceName === choice.name
                            ? "border-teal-700 bg-teal-100"
                            : "border-gray-300 bg-white"
                        }`}
                        onClick={() => setSelectedChoiceName(choice.name)}
                      >
                        {choice.name}
                      </button>
                    ))}
                  </div>
                  {selectedChoice?.description && (
                    <p className="mt-2 whitespace-pre-line">
                      {selectedChoice.description}
                    </p>
                  )}
                </div>
              )}
            </div>
            {selectedItem.unlockedAction && (
              <ActionBox action={selectedItem.unlockedAction} />
            )}
            <button
              type="button"
              disabled={
                isDisabled(selectedItem) ||
                Boolean(
                  selectedItem.choiceOptions?.length && !selectedChoiceName,
                )
              }
              className="bg-lime-300 p-1 rounded-md mt-4 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed self-start"
              onClick={() =>
                onConfirm(selectedItem.name, selectedChoiceName || undefined)
              }
            >
              {confirmLabel}
            </button>
          </div>
        ) : (
          <p>Select a choice from the list.</p>
        )}
      </div>
    </>
  );
}
