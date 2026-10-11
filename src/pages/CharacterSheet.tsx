import TabbedSection from "../components/CharacterSheet/TabbedSection/TabbedPanel";
import CoreStatSection from "../components/CharacterSheet/CoreStatSection/CoreStatsSection";
import OtherStatSection from "../components/CharacterSheet/OtherInfoSection/OtherStatSection";
import LevelSidebar from "../components/CharacterSheet/Sidebar/LevelSidebar";
import SkillsTable from "../components/CharacterSheet/SkillTable";
import { Helmet } from "react-helmet-async";

export default function CharacterSheet() {
  return (
    <>
      <Helmet>
        <title>Kastorix - Character Sheet</title>
      </Helmet>
      <div className="flex flex-row">
        <LevelSidebar />
        <SkillsTable />
        <div>
          <div className="flex flex-row">
            <CoreStatSection />
            <OtherStatSection />
          </div>
          <TabbedSection />
        </div>
      </div>
    </>
  );
}
