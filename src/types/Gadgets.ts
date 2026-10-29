export type Gadget = {
  name: string;
  type: GadgetType;
  effect: string;
  level: number;
  upgrade: string;
  upgradeLevel: number;
};

export type GadgetType = "Bomb" | "Equipment" | "Thrown Device" | "Held Item";
