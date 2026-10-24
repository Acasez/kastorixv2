// data/prices
import type { Currency, Price } from "../types/Item";

const CURRENCIES: Record<string, { currency: Currency; goldValue: number }> = {
  pp: { currency: "Platinum Piece", goldValue: 10 },
  gp: { currency: "Gold Piece", goldValue: 1 },
  sp: { currency: "Silver Piece", goldValue: 0.1 },
  cp: { currency: "Copper Device", goldValue: 0.01 },
};

export function parsePrice(priceString: string): Price | undefined {
  if (!priceString?.trim()) return undefined;
  const trimmed = priceString?.trim();
  if (!trimmed) {
    throw new Error(`Missing price: "${priceString}"`);
  }

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
  return {
    amount,
    currency: entry.currency,
    convertedAmount: amount * entry.goldValue,
  };
}

const CURRENCY_CODES: Record<Currency, string> = {
  "Platinum Piece": "pp",
  "Gold Piece": "gp",
  "Silver Piece": "sp",
  "Copper Device": "cp",
};

export function formatPrice(price?: Price): string {
  if (!price) return "—";

  const code = CURRENCY_CODES[price.currency] ?? "?";
  const amount =
    price.amount % 1 === 0
      ? String(price.amount)
      : price.amount.toFixed(2).replace(/\.?0+$/, "");

  return `${amount} ${code}`;
}
