import type { Trait } from "../../types/Trait";

export default function TraitTooltip({
  trait,
  children,
}: {
  trait: Trait;
  children: React.ReactNode;
}) {
  return (
    <span className="group relative cursor-help underline decoration-dotted underline-offset-4">
      {children}
      <span
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-72
                   -translate-x-1/2 rounded-lg bg-gray-900 p-3 text-left text-sm
                   text-white opacity-0 shadow-lg transition-opacity
                   group-hover:opacity-100"
      >
        <span className="mb-1 block font-bold">{trait.name}</span>
        <span className="block italic text-gray-300">{trait.flavor}</span>
        <span className="mt-1 block">{trait.effect}</span>
      </span>
    </span>
  );
}
