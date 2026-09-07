import { useCharacter } from "./CharacterContext";
import CharacterPanel from "./CharacterPanel";
import LevelCard from "./LevelCard";
import SaveLoadButtons from "./SaveLoadButtons";

export default function LevelSidebar() {
  const levels = Array.from({ length: 21 }, (_, i) => i); // 0 to 20
  const { character } = useCharacter();

  return (
    <div className="w-80 p-4 bg-gray-100 rounded-lg shadow-lg overflow-y-auto max-h-screen">
      <h1>{character.name}</h1> {/* How do I get the name?*/}
      <SaveLoadButtons />
      <CharacterPanel />
      <div className="space-y-3">
        {levels.map((level) => (
          <LevelCard key={level} level={level} />
        ))}
      </div>
    </div>
  );
}
