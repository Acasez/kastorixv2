export type SpeedTypes = "Land" | "Swim" | "Climb" | "Burrow" | "Glide" | "Fly";

export type Speed = {
  name: SpeedTypes;
  amount: number;
};
