import SavingThrowDisplay from "./SavingThrowDisplay";
import StatsGrid from "./StatsGrid";

export default function CoreStatSection() {
  return (
    <div className="flex flex-col">
      <StatsGrid />
      <SavingThrowDisplay />
    </div>
  );
}
