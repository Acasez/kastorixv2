// src/components/ModalViews/ModalWrapper.tsx
import { handlers } from "./handlers";
import type { ModalRequest } from "./modalTypes";
import { getChoiceData } from "./choiceData";
import { useCharacter } from "../../hooks/useCharacter";
import { BaseStatsEditor } from "./BaseStatModal";
import { StatIncreaseModal } from "./StatIncreaseModal";
import ChoiceModalFrame from "./ChoiceModalFrame";
import ChoiceModal from "./ChoiceModal";

interface ModalWrapperProps {
  request: ModalRequest;
  closeModal: () => void;
}

export default function ModalWrapper({
  request,
  closeModal,
}: ModalWrapperProps) {
  const { character, updateCharacter } = useCharacter();
  const handler = handlers[request.type];
  const choiceData = getChoiceData(request);

  const currentValue = handler.getCurrentValue(character, request);
  const blockedChoices = handler.getBlockedChoices(character, request);

  const onConfirm = (value: string, choice?: string) => {
    handler.onConfirm(character, updateCharacter, request, value, choice);
    closeModal();
  };

  // Special cases that don't use ChoiceModal
  if (request.type === "baseStats") {
    return (
      <ChoiceModalFrame title={request.title} closeModal={closeModal}>
        <BaseStatsEditor closeModal={closeModal} />
      </ChoiceModalFrame>
    );
  }

  if (request.type === "statIncrease") {
    return (
      <ChoiceModalFrame title={request.title} closeModal={closeModal}>
        <StatIncreaseModal
          selectionKey={request.selectionKey}
          closeModal={closeModal}
        />
      </ChoiceModalFrame>
    );
  }

  // Default: use ChoiceModal
  return (
    <ChoiceModalFrame title={request.title} closeModal={closeModal}>
      <ChoiceModal
        items={choiceData[request.type]}
        confirmLabel={request.title}
        initialValue={currentValue}
        initialChoice={
          request.type === "species"
            ? null
            : (character.selections[`${request.selectionKey}:choice`] ?? null)
        }
        maxLevel={request.type === "species" ? Infinity : request.level}
        disabledNames={blockedChoices}
        filterFields={
          request.type === "spell"
            ? [
                { label: "Aspects", value: "aspects" },
                { label: "Traits", value: "traits" },
              ]
            : request.type === "weapon"
              ? [
                  { label: "Traits", value: "traits" },
                  { label: "Types", value: "type" },
                  { label: "Weapon Groups", value: "weaponGroup" },
                ]
              : undefined
        }
        onConfirm={onConfirm}
      />
    </ChoiceModalFrame>
  );
}
