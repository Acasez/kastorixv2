interface OpenModalButtonProps {
  label: string;
  onClick?: () => void;
}

export default function OpenModalButton({
  label,
  onClick = () => {},
}: OpenModalButtonProps) {
  return (
    <button className="text-md px-1 bg-green-200" onClick={onClick}>
      {label}
    </button>
  );
}
