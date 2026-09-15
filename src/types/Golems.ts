export type GolemModel = {
  name: string;
  description: string;
  phy: number;
  dex: number;
  int: number;
  wil: number;
  resistances: number;
  featureOne: string;
  featureOneDesc: string;
  saves: string;
  weapons: string;
  naturalWeapon: string;
  naturalWeaponDesc: string;
};

export type GolemUpgrade = {
  name: string;
  description: string;
  prerequisites: string;
  level: number;
};
