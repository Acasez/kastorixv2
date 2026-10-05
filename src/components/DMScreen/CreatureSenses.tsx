import { getProficiency } from "../../constants/Proficiency";
import { useCreature } from "../../hooks/useCreature";

type CreatureSensesProps = {
  blockId: number;
};

export default function CreatureSenses({ blockId }: CreatureSensesProps) {
  const { creature } = useCreature(blockId);
  const perception =
    10 +
    creature.stats.INT +
    getProficiency(creature.skills.Perception ?? "Untrained").bonus;
  const manasense =
    10 +
    creature.stats.WIL +
    getProficiency(creature.skills["Mana Sensing"] ?? "Untrained").bonus;

  return (
    <section className="p-2">
      <div className="flex flex-row justify-center text-text-light gap-3">
        <p>Passive Perception: {perception}</p>
        <p>Passive Manasense: {manasense}</p>
      </div>
    </section>
  );
}
