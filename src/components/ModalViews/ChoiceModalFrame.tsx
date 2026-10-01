import type { ReactNode } from "react";

type ChoiceModalFrameProps = {
  title: string;
  closeModal: () => void;
  children: ReactNode;
};

export default function ChoiceModalFrame({
  title,
  closeModal,
  children,
}: ChoiceModalFrameProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={closeModal}
    >
      <div
        className="h-[85vh] w-11/12 max-w-6xl overflow-auto rounded-lg border border-gray-300 bg-white p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b-2 border-striking">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          <button
            type="button"
            className="text-2xl text-gray-600 hover:text-gray-900"
            onClick={closeModal}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
