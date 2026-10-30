export type Price = {
  amount: number;
  currency: Currency;
  convertedAmount: number;
};

export type Currency =
  | "Gold Piece" /*  1 Gp */
  | "Silver Piece" /*  0.1 Gp */
  | "Copper Device" /*  0.01 Gp */
  | "Platinum Piece"; /*  10 Gp */

export type Runes = {
  name: string;
  effect: string;
  item: ItemType;
  price?: Price;
  level: number;
  requirement: string;
  striking: number;
  auraCleaving: number;
  elementalWard: number;
  hardening: number;
};

export type ItemType = "All" | "Shield" | "Armor" | "Weapon";
