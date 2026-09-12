// SkillsTable.tsx
import skills from "../../json/skills.json";
import { useCharacter } from "../../contexts/CharacterContext";
import { getProficiency, signed } from "../../constants/Proficiency";
import ProficiencyMarker from "../ProficiencyMarker";
import { STAT_COLORS } from "../../constants/Stats";
import { STRING_TO_STATKEY } from "../../types/StatKey";
import Tooltip from "../Tooltip";

export default function SkillsTable() {
  const { character } = useCharacter();

  return (
    <table className="w-70 -mt-2 border-collapse rounded-lg">
      <thead>
        <tr className="bg-gray-900 text-white">
          <th className="px-3 py-2 text-left">Skill</th>
          <th className="px-2 py-2 text-left">Stat</th>
          <th className="px-3 py-2 text-left">Mod</th>
        </tr>
      </thead>
      <tbody>
        {skills.map((skill, i) => {
          const tierName =
            character.skillProficiencies[skill.name] ?? "Untrained";
          const tier = getProficiency(tierName);
          const statValue =
            character.baseStats[STRING_TO_STATKEY[skill.stat]] ?? 0;
          const total = statValue + tier.bonus;

          return (
            <tr
              key={skill.name}
              className={i % 2 === 0 ? "bg-sky-100" : "bg-gray-800"}
            >
              <td
                className={`px-2 ${i % 2 === 0 ? "text-gray-700" : "text-gray-200"}`}
              >
                {skill.name}
              </td>
              <td
                className={`px-2 py-2 font-semibold ${STAT_COLORS[skill.stat] ?? ""}`}
              >
                {skill.stat}
              </td>
              <td className="w-20 px-3 py-2">
                <div className="flex items-center gap-2">
                  <ProficiencyMarker skillName={skill.name} />
                  <Tooltip
                    align="center"
                    content={`${skill.stat} ${statValue} + ${tier.fullName} ${tier.bonus}`}
                  >
                    <span
                      className={
                        i % 2 === 0 ? "text-gray-700" : "text-gray-200"
                      }
                    >
                      {signed(total)}
                    </span>
                  </Tooltip>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
