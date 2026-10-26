interface SectionLimitTextProps {
  text: string;
  current: number;
  max: number;
}

export default function SectionLimitText({
  text,
  current,
  max,
}: SectionLimitTextProps) {
  return (
    <>
      <p
        className={`text-right ${
          current > max
            ? "text-red-500"
            : current < max
              ? "text-green-500"
              : "text-text-light"
        }`}
      >
        {text} ({current}/{max})
      </p>
    </>
  );
}
