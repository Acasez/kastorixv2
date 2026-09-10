import HealthManaAuraBars from "./HealthManaAuraBars";
import SavingThrowDisplay from "./SavingThrowDisplay";
import StatsGrid from "./StatsGrid";

export default function CoreStatSection() {
  return (
    <div className="flex flex-col bg-gray-800 h-90 gap-3 border-x-2 rounded-lg">
      <StatsGrid />
      <hr className="border-red-500/70 mx-4" />
      <SavingThrowDisplay />
      <hr className="mx-4 border-red-500/70" />
      <HealthManaAuraBars />
    </div>
  );
}
