// HealthManaAuraBars.tsx
import { useCharacter } from "../../../contexts/CharacterContext";
import TrackBar from "../../TrackBar";

export default function HealthManaAuraBars() {
  const { character, updateCharacter } = useCharacter();
  const maxHealth = 6 + character.baseStats.PHY;
  const maxPool = 6 + (3 + character.baseStats.WIL) * character.level;

  return (
    <div className="flex items-end justify-center gap-3 ">
      <TrackBar
        label="Health"
        color="#ef4444"
        track={character.health}
        max={maxHealth}
        onChange={(health) => updateCharacter({ health })}
      />
      <TrackBar
        label="Aura"
        color="#38bdf8"
        track={character.aura}
        max={maxPool}
        onChange={(aura) => updateCharacter({ aura })}
      />
      <TrackBar
        label="Mana"
        color="#a855f7"
        track={character.mana}
        max={maxPool}
        onChange={(mana) => updateCharacter({ mana })}
      />
    </div>
  );
}
