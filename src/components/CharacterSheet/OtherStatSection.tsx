import ConditionDisplay from "./ConditionDisplay";

export default function OtherStatSection() {
  return (
    <div className="flex flex-col bg-gray-800 h-90 w-165 gap-3 border-x-2 rounded-lg -mt-2">
      <h1 className="text-striking text-center text-3xl underline">
        Status effects
      </h1>
      <ConditionDisplay />
    </div>
  );
}
