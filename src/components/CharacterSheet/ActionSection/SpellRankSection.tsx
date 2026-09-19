import { getActionIcons } from "../../../utils/actionUtils";

interface SpellRankSectionProps {
  rankName: string;
  baseDC: number;
  manaCost: number;
  onAddSpell: (rankName: string) => void;
  selectedSpells: { name: string; actions: string }[];
}

export default function SpellRankSection({
  rankName,
  baseDC,
  manaCost,
  onAddSpell,
  selectedSpells,
}: SpellRankSectionProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg underline">{rankName} Spells</span>
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
      <p className="text-red-500 text-right">
        Selected Spells ({selectedSpells.length}/0)
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        {selectedSpells.map((spell) => (
          <div
            key={spell.name}
            className="flex items-center gap-1 border border-gray-400 rounded px-2 py-1"
          >
            <span>{spell.name}</span>
            {getActionIcons(spell.actions).map((icon, index) => (
              <img
                key={`${spell.name}-action-${index}`}
                src={icon}
                alt=""
                aria-hidden="true"
                className="w-5 h-5 object-contain"
              />
            ))}
            <span className="bg-green-500 px-1 text-black">T</span>
            <span>(+2)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
