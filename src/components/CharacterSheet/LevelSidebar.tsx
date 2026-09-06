import LevelCard from "./LevelCard";

export default function LevelSidebar() {
  const levels = Array.from({ length: 21 }, (_, i) => i); // 0 to 20

  return (
    <div className="w-80 p-4 bg-gray-100 rounded-lg shadow-lg overflow-y-auto max-h-screen">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Level Progression
      </h2>
      <div className="space-y-4">
        {levels.map((level) => (
          <LevelCard key={level} level={level} />
        ))}
      </div>
    </div>
  );
}
