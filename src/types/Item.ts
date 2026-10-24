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
