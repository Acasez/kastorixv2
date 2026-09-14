import { splitTraitDescription } from "../utils/splitTraitDesc";

interface TraitRowProps {
  traitName: string;
  traitDescription: string;
}
export default function TraitRow({
  traitName,
  traitDescription,
}: TraitRowProps) {
  const { flavor, mechanics } = splitTraitDescription(traitDescription);

  return (
    <div>
      <h3 className="font-semibold">{traitName}</h3>
      {flavor && <p className="italic mb-1">{flavor}.</p>}
      {mechanics && (
        <p>
          {mechanics}
          {mechanics.endsWith(".") ? "" : "."}
        </p>
      )}
    </div>
  );
}
