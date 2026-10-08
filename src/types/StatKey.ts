export type StatKey = "PHY" | "DEX" | "INT" | "WIL";

export const STRING_TO_STATKEY: Record<string, StatKey> = {
  PHY: "PHY",
  DEX: "DEX",
  INT: "INT",
  WIL: "WIL",
};

export const BASE_STAT_KEYS: { key: StatKey; label: string }[] = [
  { key: "PHY", label: "Physique" },
  { key: "DEX", label: "Dexterity" },
  { key: "INT", label: "Intelligence" },
  { key: "WIL", label: "Willpower" },
];
