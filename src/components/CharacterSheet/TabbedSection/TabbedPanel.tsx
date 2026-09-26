import { useState } from "react";
import SpellsSection from "./SpellsSection";
import StrikesSection from "./StrikesSection";
import ActionsSection from "./ActionsSection";
import InventorySection from "./InventorySection";
import GadgetSection from "./GadgetSection";
import { useCharacter } from "../../../contexts/CharacterContext";
import { getCharacterGadgetGrant } from "../../../utils/characterSpellGrants";

type TabKey = "Spells" | "Strikes" | "Actions" | "Inventory" | "Gadgets";

export default function TabbedSection() {
  const { character } = useCharacter();
  const hasGadgetAccess = getCharacterGadgetGrant(character) > 0;
  // State to track the active tab
  const [activeTab, setActiveTab] = useState<TabKey>("Spells");

  // Tab labels and their corresponding content
  const tabs: { label: string; key: TabKey }[] = [
    { label: "Spells", key: "Spells" },
    { label: "Strikes", key: "Strikes" },
    { label: "Actions", key: "Actions" },
    { label: "Inventory", key: "Inventory" },
    ...(hasGadgetAccess ? [{ label: "Gadgets", key: "Gadgets" as const }] : []),
  ];
  const visibleActiveTab =
    activeTab === "Gadgets" && !hasGadgetAccess ? "Spells" : activeTab;

  // Content for each tab (replace with your actual content)
  const tabContent = {
    Spells: <SpellsSection />,
    Strikes: <StrikesSection />,
    Actions: <ActionsSection />,
    Inventory: <InventorySection />,
    Gadgets: <GadgetSection />,
  };

  return (
    <div className="flex flex-col bg-gray-700 gap-3 border-x-2 rounded-lg">
      {/* Tab Headers */}
      <div className="flex flex-row m-1 gap-5 border-b-3 border-striking">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-3xl text-center mb-2 ${
              visibleActiveTab === tab.key
                ? "text-striking underline font-bold"
                : "text-gray-400 hover:text-striking"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-visible p-2">
        {tabContent[visibleActiveTab]}
      </div>
    </div>
  );
}
