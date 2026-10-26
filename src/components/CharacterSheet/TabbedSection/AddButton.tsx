interface AddButtonProps {
  onClick: (variable: string) => void;
  variable?: string;
}

export default function AddButton({ onClick, variable }: AddButtonProps) {
  return (
    <>
      <button
        type="button"
        className="bg-gray-600 text-white px-3 py-1 rounded border-2 border-button-add"
        onClick={() => onClick(variable ?? "")}
      >
        +
      </button>
    </>
  );
}
