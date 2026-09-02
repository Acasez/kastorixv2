import "../CSS/RowStructure.css";

interface RowProps {
  reverse: boolean;
  children: React.ReactNode;
  introRow?: boolean;
  vertical?: boolean;
}

export default function RowFrame({
  reverse,
  children,
  introRow,
  vertical,
}: RowProps) {
  const className = [
    "portfolio-row",
    reverse ? "reverse" : "",
    introRow ? "intro-row" : "",
    vertical ? "vertical-row" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={className}>{children}</div>;
}
