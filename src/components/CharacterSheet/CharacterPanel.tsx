import { useState, type SetStateAction } from "react";
import ActionButton from "./ActionButton";

export default function CharacterPanel() {
  const [characterName, setCharacterName] = useState("");
  /* const [species, setSpecies] = useState(""); */
  const [level, setLevel] = useState(1);

  const handleNameChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setCharacterName(e.target.value);
  };

  /* const handleSpeciesChange = (e) => {
    setSpecies(e.target.value);
  }; */

  const handleLevelChange = (e: { target: { value: string } }) => {
    const newLevel = Number(e.target.value);
    if (newLevel >= 0 && newLevel <= 20) {
      setLevel(newLevel);
    }
  };

  return (
    <div className="bg-blue-100 rounded-lg p-4 mb-4 shadow-sm border border-blue-300 w-full">
      {/* Character Metadata */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Name</h2>
        <input
          type="text"
          value={characterName}
          onChange={handleNameChange}
          placeholder="Character Name"
          className="w-full px-3 py-2 rounded-md border border-gray-300 mb-4"
        />
      </div>

      <div className="space-y-2">
        <ActionButton label="Select Species" />
        <ActionButton label="Set Base Stats" />
      </div>

      {/* Level Input */}
      <div className="flex items-center space-x-2 mt-4">
        <span className="text-lg font-medium text-gray-700">Level</span>
        <input
          type="number"
          value={level}
          onChange={handleLevelChange}
          min="0"
          max="20"
          className="w-12 px-2 py-1 rounded-md border border-gray-300 text-center"
        />
      </div>
    </div>
  );
}
