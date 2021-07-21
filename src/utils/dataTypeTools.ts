export function isNullOrUndefined (value: any): boolean {
  return value === null || value === void 0;
}

export function singleOrArrayToArray <T> (value?: T | T[]): T[] {
  return isNullOrUndefined(value) ? [] : Array.isArray(value) ? value : [value!];
}

export function getSingleOrArrayFirst <T> (value?: T | T[]): T | undefined {
  return Array.isArray(value) ? value[0] : value;
}
