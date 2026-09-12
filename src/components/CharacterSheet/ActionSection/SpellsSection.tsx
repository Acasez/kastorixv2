export default function SpellsSection() {
  return (
    <div className="p-4 text-white">
      <h2 className="text-xl mb-2">Spellshaping Bonus: 2</h2>
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg">Apprentice Spells</span>
          <button className="bg-gray-600 text-white px-3 py-1 rounded">
            +
          </button>
        </div>
        <p>DC 12, Complex DC 15, Mana Cost 3</p>
        <p>Selected Spells (0/0)</p>
      </div>
    </div>
  );
}
