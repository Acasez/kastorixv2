interface SpellRankSectionProps {
  rankName: string;
  baseDC: number;
  manaCost: number;
  onAddSpell: (rankName: string) => void;
}

export default function SpellRankSection({
  rankName,
  baseDC,
  manaCost,
  onAddSpell,
}: SpellRankSectionProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg">{rankName} Spells</span>
        <button
          type="button"
          className="bg-gray-600 text-white px-3 py-1 rounded"
          onClick={() => onAddSpell(rankName)}
        >
          +
        </button>
      </div>
      <p>
        DC {baseDC}, Complex DC {baseDC + 3}, Mana Cost {manaCost}
      </p>
      <p>Selected Spells (0/0)</p>
    </div>
  );
}
