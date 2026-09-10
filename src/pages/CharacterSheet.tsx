import CoreStatSection from "../components/CharacterSheet/CoreStatSection/CoreStatsSection";
import LevelSidebar from "../components/CharacterSheet/LevelSidebar";
import OtherStatSection from "../components/CharacterSheet/OtherStatSection";
import SkillsTable from "../components/CharacterSheet/SkillTable";
import { CharacterProvider } from "../contexts/CharacterProvider";

export default function RPGOverview() {
  return (
    <>
      <CharacterProvider>
        <div className="flex flex-row">
          <LevelSidebar />
          <SkillsTable />
          <CoreStatSection />
          <OtherStatSection />
        </div>
      </CharacterProvider>
    </>
  );
}
