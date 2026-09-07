// NumberInput.tsx
type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export default function NumberInput({
  value,
  onChange,
  min = -5,
  max = 10,
}: NumberInputProps) {
  const clamp = (value: number) =>
    Math.min(max, Math.max(min, Number.isNaN(value) ? 0 : value));

  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(clamp(Number(e.target.value)))}
      className="w-16 rounded border border-orange-300 bg-white px-1 py-0.5 text-center font-bold"
    />
  );
}
