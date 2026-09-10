// HealthManaAuraBars.tsx
import { useCharacter } from "../../contexts/CharacterContext";
import TrackBar from "./TrackBar";

export default function HealthManaAuraBars() {
  const { character, updateCharacter } = useCharacter();

  return (
    <div className="flex items-center justify-center">
      <TrackBar
        label="Health"
        color="#f87171"
        track={character.health}
        onChange={(health) => updateCharacter({ health })}
      />
      <TrackBar
        label="Aura"
        color="#60a5fa"
        track={character.aura}
        onChange={(aura) => updateCharacter({ aura })}
      />
      <TrackBar
        label="Mana"
        color="#c084fc"
        track={character.mana}
        onChange={(mana) => updateCharacter({ mana })}
      />
    </div>
  );
}
