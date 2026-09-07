import LevelSidebar from "../components/CharacterSheet/LevelSidebar";
import SkillsTable from "../components/CharacterSheet/SkillTable";
import { CharacterProvider } from "../contexts/CharacterProvider";

export default function RPGOverview() {
  return (
    <>
      <CharacterProvider>
        <div className="flex flex-row">
          <LevelSidebar />
          <SkillsTable />
        </div>
      </CharacterProvider>
    </>
  );
}
