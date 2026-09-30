interface OpenModalButtonProps {
  label: string;
  onClick?: () => void;
  variant: MetaButtonStyle;
}

type MetaButtonStyle = "characterSheet" | "dmScreen";

const META_BUTTON_STYLE: Record<MetaButtonStyle, string> = {
  characterSheet: "text-md px-1 bg-green-200 text-text-black",
  dmScreen:
    "border border-bg-wood-border bg-bg-wood hover:bg-bg-redwood rounded-sm px-2 py-1 font-bold",
};

export default function MetaButton({
  label,
  onClick = () => {},
  variant: style,
}: OpenModalButtonProps) {
  return (
    <button className={META_BUTTON_STYLE[style]} onClick={onClick}>
      {label}
    </button>
  );
}
