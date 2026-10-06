export type GolemModel = {
  name: string;
  description: string;
  phy: number;
  dex: number;
  int: number;
  wil: number;
  resistances: number;
  landSpeed: number;
  featureOne: string;
  featureOneDesc: string;
  skills: string;
  saves: string;
  weapons: string;
  naturalWeapon: string;
};

export type GolemUpgrade = {
  name: string;
  description: string;
  prerequisites: string;
  level: number;
  golemWeapon: string;
  unlockedAction: string;
  healthBase: number;
  healthIncrease: string;
  elementalResistance: number;
};
