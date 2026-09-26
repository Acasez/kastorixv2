export function evaluateCharacterExpression(
  expression: string,
  variables: Record<string, number>,
): number {
  const tokens = expression.match(/[A-Za-z]+|\d+(?:\.\d+)?|[()+\-*/]/g);
  if (!tokens || tokens.join("") !== expression.replace(/\s+/g, "")) return 0;

  let position = 0;

  const parseExpression = (): number => {
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
      throw new Error("Unknown expression token");
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
