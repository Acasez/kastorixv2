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
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        onClick={closeModal}
      >
        <div
          className="bg-white rounded-lg p-8 max-w-4xl w-11/12 max-h-[90vh] overflow-auto shadow-2xl border border-gray-300"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {openModalLabel}
          </h2>
          <p className="text-gray-600">
            Modal content for {openModalLabel} goes here.
          </p>
        </div>
      </div>
    </>
  );
}
