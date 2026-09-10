// HealthManaAuraBars.tsx
import { useCharacter } from "../../../contexts/CharacterContext";
import TrackBar from "../../TrackBar";

export default function HealthManaAuraBars() {
  const { character, updateCharacter } = useCharacter();

  return (
    <div className="flex items-end justify-center gap-3 ">
      <TrackBar
        label="Health"
        color="#ef4444"
        track={character.health}
        onChange={(health) => updateCharacter({ health })}
      />
      <TrackBar
        label="Aura"
        color="#38bdf8"
        track={character.aura}
        onChange={(aura) => updateCharacter({ aura })}
      />
      <TrackBar
        label="Mana"
        color="#a855f7"
        track={character.mana}
        onChange={(mana) => updateCharacter({ mana })}
      />
    </div>
  );
}
