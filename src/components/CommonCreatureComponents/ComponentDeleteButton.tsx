interface ComponentDeleteButtonProps {
  objectName: string;
  objectClass?: string;
  onClick: (skillName: string) => void;
}

export default function ComponentDeleteButton({
  objectName,
  onClick,
  objectClass,
}: ComponentDeleteButtonProps) {
  return (
    <button
      type="button"
      className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold leading-none text-white hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
      onClick={() => onClick(objectName)}
      aria-label={`Remove ${objectName} ${objectClass}}`}
      title={`Remove ${objectName} ${objectClass}}`}
    >
      ×
    </button>
  );
}
