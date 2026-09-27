export type GolemModel = {
  name: string;
  description: string;
  phy: string;
  dex: string;
  int: string;
  wil: string;
  resistances: string;
  featureOne: string;
  featureOneDesc: string;
  saves: string;
  weapons: string;
  naturalWeapon: string;
};

export type GolemUpgrade = {
  name: string;
  description: string;
  prerequisites: string;
  level: string;
  golemWeapon: string;
  unlockedAction: string;
  healthBase: string;
  healthIncrease: string;
  elementalResistance: string;
};
