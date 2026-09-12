import ActionSection from "../components/CharacterSheet/ActionSection/ActionSection";
import CoreStatSection from "../components/CharacterSheet/CoreStatSection/CoreStatsSection";
import LevelSidebar from "../components/CharacterSheet/LevelSidebar";
import OtherStatSection from "../components/CharacterSheet/OtherInfoSection/OtherStatSection";
import SkillsTable from "../components/CharacterSheet/SkillTable";
import { CharacterProvider } from "../contexts/CharacterProvider";

export default function RPGOverview() {
  return (
    <>
      <CharacterProvider>
        <div className="flex flex-row">
          <LevelSidebar />
          <SkillsTable />
          <div>
            <div className="flex flex-row">
              <CoreStatSection />
              <OtherStatSection />
            </div>
            <ActionSection />
          </div>
        </div>
      </CharacterProvider>
    </>
  );
}
