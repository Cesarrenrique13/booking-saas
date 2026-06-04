export function isValidNumber(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  const n = Number(value as any);
  return !Number.isNaN(n) && typeof n === 'number';
}

export function toNumber(value: unknown, fallback = 0): number {
  if (value === undefined || value === null || typeof value === 'object')
    return fallback;

  const parsed = parseFloat(String(value as string | number | boolean));

  return Number.isNaN(parsed) ? fallback : parsed;
}
