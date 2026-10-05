import CharacterHealthManaAuraBars from "./CharacterHealthManaAuraBars";
import SavingThrowDisplay from "./SavingThrowDisplay";
import StatsGrid from "../../Buttons/StatsGrid";
import { useCharacter } from "../../../hooks/useCharacter";

export default function CoreStatSection() {
  const { character, updateCharacter } = useCharacter();

  return (
    <div className="flex flex-col bg-gray-800 h-90 gap-3 border-x-2 rounded-lg -mt-2">
      <h1 className="text-3xl text-striking text-center underline">Stats</h1>
      <StatsGrid
        stats={character.baseStats}
        onStatChange={(key, value) =>
          updateCharacter({
            baseStats: { ...character.baseStats, [key]: value },
          })
        }
      />
      <hr className="border-red-500/70 mx-4" />
      <SavingThrowDisplay />
      <hr className="mx-4 border-red-500/70" />
      <CharacterHealthManaAuraBars />
    </div>
  );
}
