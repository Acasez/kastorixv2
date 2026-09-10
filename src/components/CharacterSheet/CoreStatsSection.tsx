import HealthManaAuraBars from "./HealthManaAuraBars";
import SavingThrowDisplay from "./SavingThrowDisplay";
import StatsGrid from "./StatsGrid";

export default function CoreStatSection() {
  return (
    <div className="flex flex-col bg-gray-700 h-80 gap-3">
      <StatsGrid />
      <SavingThrowDisplay />
      <HealthManaAuraBars />
    </div>
  );
}
