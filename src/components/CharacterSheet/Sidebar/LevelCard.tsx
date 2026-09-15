import { useState } from "react";
import OpenModalButton from "../OpenModalButton";
import ModalWrapper from "../../ModalWrapper";
import { getLevelActions } from "../../../utils/LevelCardUtils";

interface LevelCardProps {
  level: number;
}

export default function LevelCard({ level }: LevelCardProps) {
  const actions = getLevelActions(level);
  const [openModalLabel, setOpenModalLabel] = useState<string | null>(null);

  const closeModal = () => setOpenModalLabel(null);
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
              onClick={() => setOpenModalLabel(action)}
            />
          );
        })}
      </div>
      {/* Modal Overlay */}
      {openModalLabel && (
        <ModalWrapper openModalLabel={openModalLabel} closeModal={closeModal} />
      )}
    </div>
  );
}
