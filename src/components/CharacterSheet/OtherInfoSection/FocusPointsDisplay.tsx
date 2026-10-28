import { useEffect } from "react";
import { useCharacter } from "../../../hooks/useCharacter";
import NumberInput from "../../CommonCreatureComponents/NumberInput";

export default function FocusPointsDisplay() {
  const { character, updateCharacter } = useCharacter();

  const maxPoints = 1 + Math.floor(character.level / 4);

  useEffect(() => {
    if (character.focusPoints.max !== maxPoints) {
      updateCharacter({
        focusPoints: {
          current: Math.min(character.focusPoints.current, maxPoints),
          max: maxPoints,
        },
      });
    }
  }, [character.focusPoints, maxPoints, updateCharacter]);

  return (
    <>
      <span className="text-lg text-text-light">Focus Points:</span>
      <NumberInput
        value={character.focusPoints.current}
        min={0}
        max={character.focusPoints.max}
        onChange={(current) =>
          updateCharacter({
            focusPoints: { ...character.focusPoints, current },
          })
        }
      />
      <span className="text-text-light text-xl">
        / {character.focusPoints.max}
      </span>
    </>
  );
}
