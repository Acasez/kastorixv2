export const toNumber = (v: unknown): number | undefined => {
  if (v === null || v === undefined || (v as string) === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};
