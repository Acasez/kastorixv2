import { useState } from "react";
import OpenModalButton from "../OpenModalButton";
import { useCharacter } from "../../../contexts/CharacterContext";

export default function CharacterPanel() {
  const { character, handleNameChange, handleLevelChange } = useCharacter();
  const [openModalLabel, setOpenModalLabel] = useState<string | null>(null);

  const closeModal = () => setOpenModalLabel(null);

  return (
    <div className="bg-blue-100 rounded-lg p-2 mb-4 shadow-sm border border-blue-300 w-full">
      <div className="mb-3">
        <input
          type="text"
          value={character.name}
          onChange={handleNameChange}
          placeholder="Character Name"
          className="w-full px-2 py-1 rounded-lg border-2 border-blue-400 text-xl font-bold text-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1">
        <OpenModalButton
          label="Select Species"
          onClick={() => setOpenModalLabel("Select Species")}
        />
        <OpenModalButton
          label="Set Base Stats"
          onClick={() => setOpenModalLabel("Set Base Stats")}
        />
      </div>

      <div className="flex items-center justify-center space-x-3 mt-2 p-1 bg-blue-200 rounded-lg border border-blue-400">
        <span className="text-xl font-bold text-gray-800">Level</span>
        <input
          type="number"
          value={character.level}
          onChange={handleLevelChange}
          min="0"
          max="20"
          className="w-20 px-2 py-2 rounded-md border-2 border-blue-400 text-xl font-bold text-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Modal Overlay */}
      {openModalLabel && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-4xl w-11/12 max-h-[90vh] overflow-auto shadow-2xl border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {openModalLabel}
            </h2>
            <p className="text-gray-600">
              Modal content for {openModalLabel} goes here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
