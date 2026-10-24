// data/weapons.ts (or better: data/prices.ts so items can share it)
import type { Currency, Price } from "../types/Item";

const CURRENCIES: Record<string, { currency: Currency; goldValue: number }> = {
  pp: { currency: "Platinum Piece", goldValue: 10 },
  gp: { currency: "Gold Piece", goldValue: 1 },
  sp: { currency: "Silver Piece", goldValue: 0.1 },
  cp: { currency: "Copper Device", goldValue: 0.01 },
};

export function parsePrice(priceString: string): Price[] {
  const trimmed = priceString?.trim();
  if (!trimmed) return [];

  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (!match) {
    throw new Error(`Unparseable price: "${priceString}"`);
  }

  const [, amountStr, code] = match;
  const entry = CURRENCIES[code.toLowerCase()];
  if (!entry) {
    throw new Error(`Unknown currency: "${code}" in "${priceString}"`);
  }

  const amount = Number(amountStr);
  return [
    {
      amount,
      currency: entry.currency,
      convertedAmount: amount * entry.goldValue,
    },
  ];
}
