import OpenModalButton from "./OpenModalButton";
import { useCharacter } from "../../contexts/CharacterContext";

export default function CharacterPanel() {
  const { character, handleNameChange, handleLevelChange } = useCharacter();

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
        <OpenModalButton label="Select Species" />
        <OpenModalButton label="Set Base Stats" />
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
    </div>
  );
}
