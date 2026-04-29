export function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every((v) => typeof v === 'string');
}
