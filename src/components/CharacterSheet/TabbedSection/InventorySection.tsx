import { useCharacter } from "../../../contexts/CharacterContext";

export default function InventorySection() {
  const { character, handleGoldChange, handleInventoryChange } = useCharacter();
  return (
    <div className="p-4 text-white">
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="text-xl mb-2">Inventory Content</h2>
          <p>Here is the inventory</p>
        </div>
        <div className="flex items-center justify-center space-x-3 mt-2 p-1 bg-blue-200 rounded-lg border border-blue-400">
          <span className="text-xl font-bold text-text-black">Gold</span>
          <input
            type="number"
            value={character.gold}
            onChange={handleGoldChange}
            min="0"
            max="99999"
            className="w-20 px-2 py-2 rounded-md border-2 border-blue-400 text-xl font-bold text-center bg-white focus:outline-none focus:ring-2 text-text-black focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <span className="text-xl font-bold text-text-light">Inventory</span>
        <textarea
          value={character.inventory}
          onChange={handleInventoryChange}
          placeholder="Inventory"
          rows={10}
          className="w-full min-h-48 resize-y rounded-lg border-2 border-blue-400 bg-white px-2 py-2 text-text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
