import type { SetStateAction } from "react";
import type { ChoiceItem } from "./ChoiceModal";

interface ModalItemButtonProps {
  item: ChoiceItem;
  isDisabled: (item: ChoiceItem) => boolean;
  selectedName: string;
  setSelectedName: (value: SetStateAction<string>) => void;
  setSelectedChoiceName: (value: SetStateAction<string>) => void;
  initialValue: string | null;
  initialChoice: string | null;
}

export default function ModalItemButton({
  item,
  isDisabled,
  selectedName,
  setSelectedName,
  setSelectedChoiceName,
  initialValue,
  initialChoice,
}: ModalItemButtonProps) {
  return (
    <button
      type="button"
      key={item.name}
      disabled={isDisabled(item)}
      className={`text-left text-text-black border-2 px-2 py-1 ${
        isDisabled(item)
          ? "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed"
          : selectedName === item.name
            ? "border-purple-500 bg-purple-100"
            : "border-amber-200 bg-bg-rules text-text-dark"
      }`}
      onClick={() => {
        setSelectedName(item.name);
        setSelectedChoiceName(
          item.name === initialValue ? (initialChoice ?? "") : "",
        );
      }}
    >
      <span className="flex items-center gap-1">
        {item.name}
        {item.actionIcons?.map((icon, index) => (
          <img
            key={`${item.name}-action-${index}`}
            src={icon}
            alt=""
            aria-hidden="true"
            className="w-5 h-5 object-contain"
          />
        ))}
        {item.level !== undefined && ` [${item.level}]`}
      </span>
    </button>
  );
}
