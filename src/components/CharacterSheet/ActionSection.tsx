import { useState } from "react";

export default function ActionSection() {
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
    Spells: (
      <div className="p-4 text-white">
        <h2 className="text-xl mb-2">Spellshaping Bonus: 2</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Apprentice Spells</span>
            <button className="bg-gray-600 text-white px-3 py-1 rounded">
              +
            </button>
          </div>
          <p>DC 12, Complex DC 15, Mana Cost 3</p>
          <p>Selected Spells (0/0)</p>
        </div>
      </div>
    ),
    Strikes: (
      <div className="p-4 text-white">
        <h2 className="text-xl mb-2">Strikes Content</h2>
        <p>This is the Strikes tab content.</p>
      </div>
    ),
    Actions: (
      <div className="p-4 text-white">
        <h2 className="text-xl mb-2">Actions Content</h2>
        <p>This is the Actions tab content.</p>
      </div>
    ),
    Inventory: (
      <div className="p-4 text-white">
        <h2 className="text-xl mb-2">Inventory Content</h2>
        <p>This is the Inventory tab content.</p>
      </div>
    ),
  };

  return (
    <div className="flex flex-col bg-gray-700 h-150 gap-3 border-x-2 rounded-lg">
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
      <div className="flex-1 overflow-auto p-2">{tabContent[activeTab]}</div>
    </div>
  );
}
