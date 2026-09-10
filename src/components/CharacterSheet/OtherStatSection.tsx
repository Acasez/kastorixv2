import HealthManaAuraBars from "./CoreStatSection/HealthManaAuraBars";
import SavingThrowDisplay from "./CoreStatSection/SavingThrowDisplay";
import StatsGrid from "./CoreStatSection/StatsGrid";

export default function OtherStatSection() {
  return (
    <div className="flex flex-col bg-gray-800 h-90 gap-3 border-x-2 rounded-lg -mt-2">
      <StatsGrid />
      <hr className="border-red-500/70 mx-4" />
      <SavingThrowDisplay />
      <hr className="mx-4 border-red-500/70" />
      <HealthManaAuraBars />
    </div>
  );
}
