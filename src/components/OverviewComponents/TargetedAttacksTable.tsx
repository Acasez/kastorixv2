import Table from "../Layout/Table";

export function TargetedAttacksTable() {
  const data = [
    {
      target: "Head",
      reflexBonus: "+6",
      hitEffect: "The creature is dazed 2",
    },
    {
      target: "Arms",
      reflexBonus: "+3",
      hitEffect:
        "The creature has -3 penalty to attacks and actions with that arm until the end of their next turn",
    },
    {
      target: "Legs",
      reflexBonus: "+3",
      hitEffect: "The creature has -2 tile move speed next turn",
    },
    {
      target: "Eyes",
      reflexBonus: "+10",
      hitEffect: "The creature is blinded next turn",
    },
    {
      target: "Armor Weak Point",
      reflexBonus: "Varies",
      hitEffect: "The hit bypasses armor resistance",
    },
  ];

  const columns = [
    { key: "target", header: "Target", width: "20%" },
    { key: "reflexBonus", header: "Reflex Bonus", width: "20%" },
    { key: "hitEffect", header: "Hit Effect", width: "60%" },
  ];

  return (
    <div className="max-w-4xl mx-auto w-500">
      <h1 className="text-2xl font-bold mb-4 text-text-black text-center">
        Called Shot Table
      </h1>
      <Table
        columns={columns}
        data={data}
        isDarkMode={true}
        headerClassName="text-lg"
      />
    </div>
  );
}
