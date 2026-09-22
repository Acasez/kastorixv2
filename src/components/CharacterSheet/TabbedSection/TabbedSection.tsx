import { useState } from "react";
import SpellsSection from "./SpellsSection";
import StrikesSection from "./StrikesSection";
import ActionsSection from "./ActionsSection";
import InventorySection from "./InventorySection";

export default function TabbedSection() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState<
    "Spells" | "Strikes" | "Actions" | "Inventory"
  >("Spells");

  // Tab labels and their corresponding content
  const tabs = [
    { label: "Spells", key: "Spells" },
    { label: "Strikes", key: "Strikes" },
    { label: "Actions", key: "Actions" },
    { label: "Inventory", key: "Inventory" },
  ];

  // Content for each tab (replace with your actual content)
  const tabContent = {
    Spells: <SpellsSection />,
    Strikes: <StrikesSection />,
    Actions: <ActionsSection />,
    Inventory: <InventorySection />,
  };

  return (
    <div className="flex flex-col bg-gray-700 gap-3 border-x-2 rounded-lg">
      {/* Tab Headers */}
      <div className="flex flex-row m-1 gap-5 border-b-3 border-striking">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`text-3xl text-center mb-2 ${
              activeTab === tab.key
                ? "text-striking underline font-bold"
                : "text-gray-400 hover:text-striking"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-visible p-2">{tabContent[activeTab]}</div>
    </div>
  );
}
