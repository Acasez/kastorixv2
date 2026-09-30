type CreatureTextFieldProps = {
  field: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function CreatureTextField({
  field,
  value,
  onChange,
  placeholder,
}: CreatureTextFieldProps) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-sm font-semibold leading-5 text-stone-200">
      <span>{field}</span>
      <input
        className="w-full min-w-0 rounded-xs border border-[#5b554d] bg-[#242321] px-[0.55rem] py-[0.45rem] font-normal text-[#f5eee4]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? `${field}...`}
      />
    </label>
  );
}
