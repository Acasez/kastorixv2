import SpeciesModal from "./SpeciesModal";

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
          className="bg-white rounded-lg p-8 max-w-6xl w-11/12 h-[85vh] overflow-auto shadow-2xl border border-gray-300"
          onClick={(e) => e.stopPropagation()}
        >
          <SpeciesModal
            openModalLabel={openModalLabel}
            closeModal={closeModal}
          />
        </div>
      </div>
    </>
  );
}
