import { useState } from "react";
import OpenModalButton from "../OpenModalButton";
import ModalWrapper from "../../ModalViews/ModalWrapper";
import type { ModalRequest } from "../../ModalViews/modalTypes";
import { getLevelActions } from "../../../utils/LevelCardUtils";

interface LevelCardProps {
  level: number;
}

export default function LevelCard({ level }: LevelCardProps) {
  const actions = getLevelActions(level);
  const [modalRequest, setModalRequest] = useState<ModalRequest | null>(null);

  const closeModal = () => setModalRequest(null);

  const openActionModal = (action: string) => {
    const actionTypes: Record<string, ModalRequest["type"]> = {
      "Select Background": "background",
      "Select Advantage": "advantage",
      "Select Ancestry Feat": "ancestryFeat",
      "Select Arcane Feat": "arcaneFeat",
      "Select General Feat": "generalFeat",
      "Increase One Stat": "baseStats",
    };
    const type = actionTypes[action];
    if (type) setModalRequest({ type, title: action });
  };
  return (
    <div className="bg-blue-200 rounded-lg p-2 mb-3 shadow-sm border border-blue-300">
      <h3 className="text-xl font-bold text-gray-800 -mt-1.5 mb-1 text-center">
        Level {level}
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => {
          const isHighlighted = action === "Increase One Stat";
          return (
            <OpenModalButton
              key={index}
              label={action}
              isHighlighted={isHighlighted}
              onClick={() => openActionModal(action)}
            />
          );
        })}
      </div>
      {/* Modal Overlay */}
      {modalRequest && (
        <ModalWrapper request={modalRequest} closeModal={closeModal} />
      )}
    </div>
  );
}
