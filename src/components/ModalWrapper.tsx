import species from ".././JSON/species.json";
import { useState } from "react";

interface ModalWrapperProps {
  openModalLabel: string;
  closeModal: () => void;
}

export default function ModalWrapper({
  openModalLabel,
  closeModal,
}: ModalWrapperProps) {
  const [selectedSpecies, setSelectedSpecies] = useState(species[0]); // Default to first species

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        onClick={closeModal}
      >
        <div
          className="bg-white rounded-lg p-8 max-w-6xl w-11/12 max-h-[90vh] overflow-auto shadow-2xl border border-gray-300"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-striking">
            {openModalLabel}
          </h2>
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
                        <strong>Size:</strong> {selectedSpecies.size}
                      </p>
                      <p>
                        <strong>Health:</strong> {selectedSpecies.health}
                      </p>
                      <p>
                        <strong>Mana:</strong> {selectedSpecies.mana}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="font-semibold">
                        {selectedSpecies.traitOne}
                      </h3>
                      <p>{selectedSpecies.traitOneDesc}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {selectedSpecies.traitTwo}
                      </h3>
                      <p>{selectedSpecies.traitTwoDesc}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {selectedSpecies.traitThree}
                      </h3>
                      <p>{selectedSpecies.traitThreeDesc}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {selectedSpecies.traitFour}
                      </h3>
                      <p>{selectedSpecies.traitFourDesc}</p>
                    </div>
                  </div>

                  <button
                    className="bg-lime-300 p-1 rounded-md mt-4"
                    onClick={() => closeModal()}
                  >
                    Select Species
                  </button>
                </>
              ) : (
                <p>Select a species from the left panel</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
