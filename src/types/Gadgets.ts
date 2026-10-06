export type Gadget = {
  name: string;
  type: GadgetType;
  effect: string;
  level: number;
  requirement: string;
};

export type GadgetType =
  | "Bomb"
  | "Equipment"
  | "Thrown Device"
  | "Upgrade"
  | "Held Item";
