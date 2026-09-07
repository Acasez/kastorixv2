// SkillsTable.tsx
import skills from "../../json/skills.json";
import { useCharacter } from "../../contexts/CharacterContext";
import { getProficiency } from "../../constants/Proficiency";
import ProficiencyMarker from "./ProficiencyMarker";

const STAT_COLORS: Record<string, string> = {
  DEX: "text-amber-500",
  INT: "text-blue-500",
  PHY: "text-fuchsia-600",
  WIL: "text-emerald-600",
};

export default function SkillsTable() {
  const { character } = useCharacter();

  return (
    <table className="w-70 -mt-2 border-collapse overflow-hidden rounded-lg">
      <thead>
        <tr className="bg-gray-900 text-white">
          <th className="px-3 py-2 text-left">Skill</th>
          <th className="px-3 py-2 text-left">Stat</th>
          <th className="px-3 py-2 text-left">Mod</th>
        </tr>
      </thead>
      <tbody>
        {skills.map((skill, i) => {
          const tierName =
            character.skillProficiencies[skill.name] ?? "Untrained";
          const tier = getProficiency(tierName);
          const bonus = tier.bonus;

          return (
            <tr
              key={skill.name}
              className={i % 2 === 0 ? "bg-sky-100" : "bg-gray-800"}
            >
              <td
                className={`px-3 py-2 ${i % 2 === 0 ? "text-gray-700" : "text-gray-200"}`}
              >
                {skill.name}
              </td>
              <td
                className={`px-3 py-2 font-semibold ${STAT_COLORS[skill.stat] ?? ""}`}
              >
                {skill.stat}
              </td>
              <td className="w-20 px-3 py-2">
                <div className="flex items-center gap-2">
                  <ProficiencyMarker skillName={skill.name} />
                  <span
                    className={i % 2 === 0 ? "text-gray-700" : "text-gray-200"}
                  >
                    {bonus > 0 ? `+${bonus}` : bonus}
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
