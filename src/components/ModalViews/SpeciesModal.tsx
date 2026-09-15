import species from "../../JSON/species.json";
import { useState } from "react";
import TraitRow from "../TraitRow";
import { useCharacter } from "../../contexts/CharacterContext";

interface SpeciesModalProps {
  closeModal: () => void;
}

export default function SpeciesModal({ closeModal }: SpeciesModalProps) {
  const { character, updateCharacter } = useCharacter();
  const [selectedSpecies, setSelectedSpecies] = useState(
    () => species.find((item) => item.name === character.species) ?? species[0],
  );

  const confirmSpecies = () => {
    updateCharacter({ species: selectedSpecies.name });
    closeModal();
  };

  return (
    <>
      <div className="flex flex-row gap-3">
        {/* Species Selection Panel */}
        <div className="flex flex-col w-40 gap-1">
          {species.map((speciesItem) => (
            <button
              key={speciesItem.name}
              className={`text-xl border-2 ${
                selectedSpecies?.name === speciesItem.name
                  ? "border-purple-500 bg-purple-100"
                  : "border-amber-200 bg-bg-rules"
              } text-text-dark`}
              onClick={() => setSelectedSpecies(speciesItem)}
            >
              {speciesItem.name}
            </button>
          ))}
        </div>

        {/* Species Info Panel */}
        <div className="border-amber-200 border-2 p-3 flex-1">
          {selectedSpecies ? (
            <>
              <h1 className="text-2xl underline">{selectedSpecies.name}</h1>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p>
                    <span className="font-bold">Size: </span>
                    {selectedSpecies.size}
                  </p>
                  <p>
                    <span className="font-bold">Health: </span>{" "}
                    {selectedSpecies.health}
                  </p>
                  <p>
                    <span className="font-bold">Mana: </span>{" "}
                    {selectedSpecies.mana}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <TraitRow
                  traitName={selectedSpecies.traitOne}
                  traitDescription={selectedSpecies.traitOneDesc}
                />
                <TraitRow
                  traitName={selectedSpecies.traitTwo}
                  traitDescription={selectedSpecies.traitTwoDesc}
                />
                <TraitRow
                  traitName={selectedSpecies.traitThree}
                  traitDescription={selectedSpecies.traitThreeDesc}
                />
                <TraitRow
                  traitName={selectedSpecies.traitFour}
                  traitDescription={selectedSpecies.traitFourDesc}
                />
              </div>

              <button
                className="bg-lime-300 p-1 rounded-md mt-4"
                onClick={confirmSpecies}
              >
                Select Species
              </button>
            </>
          ) : (
            <p>Select a species from the left panel</p>
          )}
        </div>
      </div>
    </>
  );
}
