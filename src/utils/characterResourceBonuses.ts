import advantages from "../JSON/advantages.json";
import ancestryFeats from "../JSON/ancestry_feats.json";
import arcaneFeats from "../JSON/arcane_feats.json";
import generalFeats from "../JSON/general_feats.json";
import type { Character } from "../contexts/CharacterContext";

type ResourceSource = {
  name: string;
  health?: string;
  mana?: string;
};

const resourceSources: ResourceSource[] = [
  ...advantages,
  ...ancestryFeats,
  ...arcaneFeats,
  ...generalFeats,
];

function evaluateExpression(
  expression: string,
  variables: Record<string, number>,
): number {
  const tokens = expression.match(/[A-Za-z]+|\d+(?:\.\d+)?|[()+\-*/]/g);
  if (!tokens || tokens.join("") !== expression.replace(/\s+/g, "")) return 0;

  let position = 0;

  const parseFactor = (): number => {
    const token = tokens[position++];
    if (token === "+") return parseFactor();
    if (token === "-") return -parseFactor();
    if (token === "(") {
      const value = parseExpression();
      if (tokens[position++] !== ")") throw new Error("Unclosed expression");
      return value;
    }
    if (/^\d/.test(token)) return Number(token);
    if (token in variables) return variables[token];
    throw new Error("Unknown resource expression token");
  };

  const parseTerm = (): number => {
    let value = parseFactor();
    while (tokens[position] === "*" || tokens[position] === "/") {
      const operator = tokens[position++];
      const right = parseFactor();
      value = operator === "*" ? value * right : value / right;
    }
    return value;
  };

  const parseExpression = (): number => {
    let value = parseTerm();
    while (tokens[position] === "+" || tokens[position] === "-") {
      const operator = tokens[position++];
      const right = parseTerm();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  };

  try {
    const result = parseExpression();
    return position === tokens.length && Number.isFinite(result) ? result : 0;
  } catch {
    return 0;
  }
}

export function getCharacterResourceBonuses(character: Character) {
  const variables = { ...character.baseStats, Level: character.level };
  const bonuses = { health: 0, mana: 0 };

  Object.values(character.selections).forEach((selectedName) => {
    const source = resourceSources.find((item) => item.name === selectedName);
    if (!source) return;
    if (source.health) {
      bonuses.health += evaluateExpression(source.health, variables);
    }
    if (source.mana) {
      bonuses.mana += evaluateExpression(source.mana, variables);
    }
  });

  return bonuses;
}
