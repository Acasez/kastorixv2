import { useState } from "react";
import conditions from "../../json/conditions.json";

export default function OtherStatSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const handleAddCondition = (conditionName: string) => {
    if (!selectedConditions.includes(conditionName)) {
      setSelectedConditions([...selectedConditions, conditionName]);
    }
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="flex flex-col bg-gray-800 h-90 w-165 gap-3 border-x-2 rounded-lg -mt-2">
      <h1 className="text-striking text-center text-3xl underline">
        Status effects
      </h1>
      <div className="flex w-9/10 h-12 rounded-2xl bg-gray-400 mx-8 items-center">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-2xl m-2 px-3 py-1 bg-black text-text-light rounded-lg"
          >
            +
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 w-38 bg-gray-700 rounded-lg shadow-lg border border-gray-600">
              {conditions.map((condition) => (
                <button
                  key={condition.name}
                  onClick={() => handleAddCondition(condition.name)}
                  className="w-full text-left px-4 py-2 text-text-light hover:bg-gray-600 rounded-lg"
                >
                  {condition.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1 ml-2">
          {selectedConditions.map((condition) => (
            <span
              key={condition}
              className="bg-gray-600 text-text-light px-3 py-1 rounded-lg text-sm"
            >
              {condition}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
