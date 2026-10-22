interface RowProps {
  reverse: boolean;
  children: React.ReactNode;
  vertical?: boolean;
}

export default function RowFrame({ reverse, children, vertical }: RowProps) {
  const base =
    "flex items-start justify-center mx-[2%] transition-[transform,box-shadow] duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]";

  const variant = vertical ? "flex-col" : reverse ? "flex-row-reverse" : "";

  return (
    <div className={[base, variant].filter(Boolean).join(" ")}>{children}</div>
  );
}
