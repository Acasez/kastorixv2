import species from ".././JSON/species.json";
/* import type { Species } from ".././types/Species"; */

interface ModalWrapperProps {
  openModalLabel: string;
  closeModal: () => void;
}

export default function ModalWrapper({
  openModalLabel,
  closeModal,
}: ModalWrapperProps) {
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
            <div className="flex flex-col w-40 gap-1">
              {species.map((species) => (
                <button className="text-xl border-2 border-amber-200 bg-bg-rules text-text-dark">
                  {species.name}
                </button>
              ))}
            </div>
            <div className="border-amber-200 border-2 p-3">
              <h1 className="text-2xl underline">Naga</h1>
              <p>
                Nagas unique form leave them well adapted for grappling When you
                have a target grappled, your hands are still free. You have +3
                saves to saves against becoming and escaping grappled or
                restrained.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
